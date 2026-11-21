import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../security/token.service';
import { TenantContextService } from '../context/tenant-context.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly tenantContext: TenantContextService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação ausente ou em formato inválido.');
    }

    const token = authHeader.split(' ')[1];
    const payload = this.tokenService.verifyAccessToken(token);

    // Valida se o token pertence ao mesmo tenant da requisição
    const contextTenantId = this.tenantContext.getTenantId();
    if (contextTenantId && contextTenantId !== payload.tenantId) {
      throw new UnauthorizedException('Acesso não autorizado para o tenant especificado.');
    }

    // Injeta os dados do usuário autenticado no request e no contexto
    req.user = payload;
    this.tenantContext.setContext({
      tenantId: payload.tenantId,
      userId: payload.sub,
      role: payload.role,
    });

    return true;
  }
}
