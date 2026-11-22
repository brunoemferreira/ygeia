import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { z } from '@ygeia/validation-schemas';
import { ZodValidationPipe } from './zod-validation.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ZodValidationPipe (Strict Payload Validation)', () => {
  const schema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    age: z.number().min(0, 'Idade não pode ser negativa'),
  });

  const pipe = new ZodValidationPipe(schema);

  test('deve validar e retornar dados sanitizados com sucesso', () => {
    const input = { name: 'Maria Silva', age: 32 };
    const result = pipe.transform(input, { type: 'body' });
    assert.deepStrictEqual(result, input);
  });

  test('deve rejeitar payload inválido com BadRequestException estruturado', () => {
    const input = { name: 'Al', age: -5 };
    assert.throws(
      () => pipe.transform(input, { type: 'body' }),
      (err: any) => {
        assert(err instanceof BadRequestException);
        const response: any = err.getResponse();
        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(response.errors.length, 2);
        assert.strictEqual(response.errors[0].field, 'name');
        assert.strictEqual(response.errors[1].field, 'age');
        return true;
      },
    );
  });

  test('deve retornar o valor inalterado caso nenhum schema esteja associado', () => {
    const genericPipe = new ZodValidationPipe();
    const rawData = { anyField: 'anyValue' };
    const result = genericPipe.transform(rawData, { type: 'body' });
    assert.deepStrictEqual(result, rawData);
  });
});
