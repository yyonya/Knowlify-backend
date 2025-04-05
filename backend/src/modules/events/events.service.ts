import { Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { ParsedUrlQuery } from 'querystring';
import { WsException } from '@nestjs/websockets';
import { ErrorLog } from 'src/errors';

@Injectable()
export class EventsService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async verifyUserForWS(
    authorization: string | undefined,
    query: ParsedUrlQuery,
  ) {
    const authHeader = authorization;
    const { page_id } = query;
    const [type, token] = authHeader?.split(' ') ?? [];

    if (type !== 'Bearer' || !token || !page_id || Array.isArray(page_id)) {
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

    return { payload, roomId };
  }
}
