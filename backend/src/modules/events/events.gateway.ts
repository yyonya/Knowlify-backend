import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenService } from '../token/token.service';
import { ErrorLog } from 'src/errors';
import { SaveTransactionsDto, TransactionDto } from './dto';
import { WorkspaceService } from '../workspace/workspace.service';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly tokenService: TokenService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  // Хранилище клиентов
  private clients = new Map<number, Socket>();
  // Хранилище транзакций по страницам
  private transactions = new Map<number, TransactionDto[]>();

  afterInit(server: Server) {
    server.use((client: Socket, next) => {
      void (async () => {
        // IIFE + void для игнорирования Promise
        try {
          const authHeader = client.handshake.headers.authorization;
          const { page_id } = client.handshake.query;
          const [type, token] = authHeader?.split(' ') ?? [];

          if (
            type !== 'Bearer' ||
            !token ||
            !page_id ||
            Array.isArray(page_id)
          ) {
            throw new WsException(ErrorLog.WS_PARAMS);
          }

          const roomId = Number(page_id);
          if (isNaN(roomId)) {
            throw new WsException(ErrorLog.WS_PARAMS);
          }

          const payload = this.tokenService.verifyJwtToken(token);
          const right = await this.workspaceService.checkRightConnectToPage(
            payload.user_id,
            roomId,
          );

          if (!right) {
            throw new WsException(ErrorLog.RIGHTS_FAILTURE);
          }

          if (this.clients.has(payload.user_id)) {
            throw new WsException(ErrorLog.WS_CONNECTION);
          }

          this.clients.set(payload.user_id, client);
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
      if (this.clients.get(user_id)?.id === client.id) {
        this.clients.delete(user_id);
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
  handleTransaction(client: Socket, payload: SaveTransactionsDto) {
    const { transactions } = payload;

    const userRooms = Array.from(client.rooms).filter(
      (room) => room !== client.id,
    );

    if (userRooms.length !== 1) {
      throw new WsException(ErrorLog.WS_ROOMS);
    }

    const [userRoom] = userRooms;
    const usersRoom = Number(userRoom);

    if (!this.transactions.has(usersRoom)) {
      this.transactions.set(usersRoom, []);
    }
    const pageTransactions = this.transactions.get(usersRoom);
    pageTransactions?.push(...transactions); //?
    console.log(pageTransactions);

    this.server.to(userRoom).emit('transaction-added', {
      count: pageTransactions?.length,
    });

    return { status: 'success', count: pageTransactions?.length };
  }
}
