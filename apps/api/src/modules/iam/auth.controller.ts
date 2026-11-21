import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService, RegisterClinicInput, LoginInput } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantContextService } from '../../common/context/tenant-context.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Post('register-clinic')
  @HttpCode(HttpStatus.CREATED)
  async registerClinic(
    @Body() body: RegisterClinicInput,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const result = await this.authService.registerClinic(body);

    // Armazena refresh token em cookie HttpOnly seguro
    res.setCookie('ygeia_refresh_token', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
    });

    return {
      message: 'Clínica e administrador cadastrados com sucesso.',
      user: result.user,
      accessToken: result.tokens.accessToken,
      expiresIn: result.tokens.expiresInSeconds,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginInput,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const tenantId = body.tenantId || this.tenantContext.getTenantId();
    const result = await this.authService.login(
      { ...body, tenantId },
      req.ip,
      req.headers['user-agent'],
    );

    res.setCookie('ygeia_refresh_token', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: 7 * 24 * 60 * 60,
    });

    return {
      message: 'Autenticado com sucesso.',
      user: result.user,
      accessToken: result.tokens.accessToken,
      expiresIn: result.tokens.expiresInSeconds,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: FastifyRequest,
    @Body('refreshToken') bodyToken?: string,
    @Res({ passthrough: true }) res?: FastifyReply,
  ) {
    // Tenta obter o refresh token do cookie HttpOnly ou do body
    const cookies = (req as any).cookies || {};
    const refreshToken = cookies.ygeia_refresh_token || bodyToken;

    const newTokens = await this.authService.refreshToken(refreshToken);

    if (res) {
      res.setCookie('ygeia_refresh_token', newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/v1/auth',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return {
      accessToken: newTokens.accessToken,
      expiresIn: newTokens.expiresInSeconds,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    const userId = req.user.sub;
    const tenantId = req.user.tenantId;
    return await this.authService.getCurrentUser(userId, tenantId);
  }
}
