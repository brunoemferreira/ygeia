import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Filtro Global de Exceções HTTP do Ygeía.
 * Padroniza respostas de erro no formato Problem Details (RFC 7807),
 * higieniza mensagens para evitar vazamento de detalhes internos da infraestrutura
 * e garante logs estruturados com método, rota e status code.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: string | string[] = 'Ocorreu um erro interno no servidor.';
    let code = HttpStatus[status] || 'INTERNAL_SERVER_ERROR';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const resp = exceptionResponse as Record<string, any>;
      message = resp.message || resp.error || message;
      code = resp.code || HttpStatus[status] || code;
    } else if (exception instanceof Error) {
      if (status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        message = exception.message;
      }
    }

    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - Erro 500:`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else {
      const formattedMessage = Array.isArray(message) ? message.join('; ') : message;
      this.logger.warn(`[${request.method}] ${request.url} - Status ${status}: ${formattedMessage}`);
    }

    response.status(status).send({
      success: false,
      error: {
        statusCode: status,
        code,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
