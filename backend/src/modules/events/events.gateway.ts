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

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tokenService: TokenService) {}

  // Хранилище клиентов
  private clients = new Map<number, Socket>();
  // Хранилище транзакций по страницам
  private transactions = new Map<number, TransactionDto[]>();

  afterInit(server: Server) {
    server.use((client: Socket, next) => {
      console.log(`Start`);
      try {
        const authHeader = client.handshake.headers.authorization;
        const [type, token] = authHeader?.split(' ') ?? [];

        if (type !== 'Bearer' || !token) {
          throw new WsException(ErrorLog.JWT_FAILTURE);
        }
        //!!!
        const payload = this.tokenService.verifyJwtToken(token);

        if (this.clients.has(payload.user_id)) {
          throw new WsException(ErrorLog.WS_CONNECTION);
        }

        this.clients.set(payload.user_id, client);
        client.data = { user_id: payload.user_id };
        console.log(`Client connected: ${payload.user_id}`);

        next();
      } catch (error) {
        if (error instanceof WsException) {
          next(error);
        } else {
          next(new WsException(ErrorLog.JWT_FAILTURE));
        }
      }
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
    const { page_id, transactions } = payload;

    if (!this.transactions.has(page_id)) {
      this.transactions.set(page_id, []);
    }
    const pageTransactions = this.transactions.get(page_id);
    pageTransactions?.push(...transactions); //?
    console.log(pageTransactions);

    this.server.to(page_id.toString()).emit('transaction-added', {
      count: pageTransactions?.length,
    });

    return { status: 'success', count: pageTransactions?.length };
  }
}
