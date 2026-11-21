import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordHasherService {
  // Parâmetros recomendados pelo OWASP para Argon2id
  private readonly options: argon2.Options = {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  };

  async hash(password: string): Promise<string> {
    if (!password || password.length < 8) {
      throw new Error('A senha deve conter no mínimo 8 caracteres.');
    }
    return await argon2.hash(password, this.options);
  }

  async verify(hash: string, plainText: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plainText);
    } catch {
      return false;
    }
  }
}
