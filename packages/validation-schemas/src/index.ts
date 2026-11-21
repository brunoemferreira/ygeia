import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail em formato inválido'),
  password: z.string().min(8, 'A senha deve conter no mínimo 8 caracteres'),
  twoFactorCode: z.string().length(6, 'O código 2FA deve conter 6 dígitos').optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const createPatientSchema = z.object({
  fullName: z.string().min(3, 'Nome deve conter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento deve seguir AAAA-MM-DD'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
