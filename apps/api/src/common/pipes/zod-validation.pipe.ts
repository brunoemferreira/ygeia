import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError, ZodIssue } from '@ygeia/validation-schemas';

/**
 * Pipe de validação estrita com Zod para requisições Fastify / NestJS.
 * Suporta injeção de schemas explícitos no construtor ou introspecção
 * de propriedades estáticas `schema` em DTOs tipados.
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema?: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const targetSchema =
      this.schema || (metadata.metatype && (metadata.metatype as any).schema);

    if (!targetSchema) {
      return value;
    }

    const result = targetSchema.safeParse(value);

    if (!result.success) {
      const error = result.error as ZodError;
      const formattedErrors = error.errors.map((issue: ZodIssue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      }));

      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Dados de entrada inválidos ou malformados.',
        errors: formattedErrors,
      });
    }

    return result.data;
  }
}
