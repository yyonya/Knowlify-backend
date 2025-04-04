import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ErrorLog } from 'src/errors';
import { Operation, TransactionsStorage } from './dto';
import { EventsService } from './events.service';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventsService: EventsService) {}

  // Хранилище клиентов
  private clientsStorage = new Map<number, Socket>();
  // Хранилище транзакций по страницам
  private transactionsStorage = new Map<number, TransactionsStorage>();

  afterInit(server: Server) {
    server.use((client: Socket, next) => {
      void (async () => {
        // IIFE + void для игнорирования Promise
        try {
          const answer = await this.eventsService.verifyUserForWS(
            client.handshake.headers.authorization,
            client.handshake.query,
          );
          const payload = answer.payload;
          const roomId = answer.roomId;

          if (this.clientsStorage.has(payload.user_id)) {
            throw new WsException(ErrorLog.WS_CONNECTION);
          }

          this.clientsStorage.set(payload.user_id, client);
          client.data = { user_id: payload.user_id };

          await client.join(roomId.toString());
          console.log(`Client ${payload.user_id} connected. To room ${roomId}`);

          next(); // Вызов next() внутри асинхронного контекста
        } catch (error) {
          next(
            error instanceof WsException
              ? error
              : new WsException(ErrorLog.JWT_FAILTURE),
          );
        }
      })(); // Самовызывающаяся асинхронная функция
    });
  }

  handleDisconnect(client: Socket) {
    if ((client.data as { user_id?: number })?.user_id) {
      const user_id = (client.data as { user_id: number }).user_id;
      if (this.clientsStorage.get(user_id)?.id === client.id) {
        this.clientsStorage.delete(user_id);
        console.log(
          `Client disconnected - User ID: ${user_id}, Socket ID: ${client.id}`,
        );
      } else {
        console.log(
          `Stale client disconnected - User ID: ${user_id}, Socket ID: ${client.id}`,
        );
      }
    } else {
      console.log(`Unknown client disconnected - Socket ID: ${client.id}`);
    }
  }

  // Добавление транзакции
  @SubscribeMessage('add-transaction')
  handleTransaction(client: Socket, operation: Operation) {
    const userRooms = Array.from(client.rooms).filter(
      (room) => room !== client.id,
    );

    if (userRooms.length !== 1) {
      throw new WsException(ErrorLog.WS_ROOMS);
    }

    const [userRoom] = userRooms;
    const usersRoom = Number(userRoom);

    if (!this.transactionsStorage.has(usersRoom)) {
      this.transactionsStorage.set(usersRoom, new TransactionsStorage());
    }

    const pageTransactions = this.transactionsStorage.get(usersRoom);
    pageTransactions?.addOperation(operation); //?
    console.log(pageTransactions);
    console.log(operation);
    // this.server.to(userRoom).emit('transaction-added', {
    //   count: pageTransactions?.getCount(),
    // });

    return { status: 'success', count: pageTransactions?.getCount() };
  }
}
