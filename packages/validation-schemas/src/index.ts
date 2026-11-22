import { z, ZodSchema, ZodError, ZodIssue } from 'zod';

export { z, ZodSchema, ZodError, ZodIssue };

export const loginSchema = z.object({
  email: z.string().email('E-mail em formato inválido'),
  password: z.string().min(8, 'A senha deve conter no mínimo 8 caracteres'),
  tenantId: z.string().uuid('ID do tenant inválido').optional(),
  slug: z.string().min(2, 'Slug deve ter pelo menos 2 caracteres').optional(),
  twoFactorCode: z.string().length(6, 'O código 2FA deve conter 6 dígitos').optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerClinicSchema = z.object({
  clinicName: z.string().min(3, 'Nome da clínica deve ter no mínimo 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter no mínimo 3 caracteres').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e traços'),
  ownerName: z.string().min(3, 'Nome do responsável deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail em formato inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
});

export type RegisterClinicInput = z.infer<typeof registerClinicSchema>;

export const updateTenantSettingsSchema = z.object({
  legalName: z.string().min(2, 'Razão social inválida').optional().nullable(),
  tradeName: z.string().min(2, 'Nome fantasia inválido').optional().nullable(),
  taxId: z.string().min(11, 'CNPJ/CPF inválido').max(18).optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email('E-mail de contato inválido').optional().nullable(),
  addressStreet: z.string().optional().nullable(),
  addressNumber: z.string().optional().nullable(),
  addressComplement: z.string().optional().nullable(),
  addressNeighborhood: z.string().optional().nullable(),
  addressCity: z.string().optional().nullable(),
  addressState: z.string().length(2, 'UF deve conter 2 letras').optional().nullable(),
  addressZipCode: z.string().optional().nullable(),
});

export type UpdateTenantSettingsInput = z.infer<typeof updateTenantSettingsSchema>;

export const updateNutritionistProfileSchema = z.object({
  fullName: z.string().min(3, 'Nome completo obrigatório'),
  professionalName: z.string().min(3, 'Nome profissional obrigatório'),
  crnNumber: z.string().min(5, 'Número de CRN obrigatório (ex: CRN-3 12345/P)'),
  crnRegion: z.string().min(4, 'Região do CRN obrigatória (ex: CRN-3)'),
  specialties: z.array(z.string()).default([]),
  bio: z.string().max(1000, 'Bio deve ter até 1000 caracteres').optional().nullable(),
  avatarUrl: z.string().url('URL de avatar inválida').optional().nullable(),
  signatureStampUrl: z.string().url('URL de assinatura inválida').optional().nullable(),
  isTechnicalManager: z.boolean().default(true),
});

export type UpdateNutritionistProfileInput = z.infer<typeof updateNutritionistProfileSchema>;

export const updateTenantBrandingSchema = z.object({
  clinicName: z.string().min(2, 'Nome da clínica obrigatório').optional(),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor primária deve ser hexadecimal (#059669)'),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor secundária deve ser hexadecimal (#064e3b)'),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor de destaque deve ser hexadecimal').optional().nullable(),
  logoUrl: z.string().url('URL do logo inválida').optional().nullable(),
  darkLogoUrl: z.string().url('URL do logo escuro inválida').optional().nullable(),
  faviconUrl: z.string().url('URL do favicon inválida').optional().nullable(),
  fontFamily: z.string().default('Plus Jakarta Sans'),
  letterheadTemplateUrl: z.string().url('URL de timbrado inválida').optional().nullable(),
});

export type UpdateTenantBrandingInput = z.infer<typeof updateTenantBrandingSchema>;

export const inviteTeamMemberSchema = z.object({
  email: z.string().email('E-mail inválido'),
  role: z.enum(['ADMIN', 'NUTRITIONIST', 'SECRETARY']),
});

export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>;

export const createPatientSchema = z.object({
  fullName: z.string().min(3, 'Nome deve conter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(8, 'Telefone inválido').max(64, 'Telefone deve conter no máximo 64 caracteres'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento deve seguir AAAA-MM-DD'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;

// Schemas dos Módulos Clínicos (Fase 2)
export const createAnamneseSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  templateType: z.string().default('Seções padrão'),
  recordDate: z.string().optional(),
  contentHtml: z.string().optional().nullable(),
  sections: z.record(z.any()).default({}),
});

export type CreateAnamneseInput = z.infer<typeof createAnamneseSchema>;

export const createRecallSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  templateType: z.string().default('Recordatório 24 Horas'),
  recordDate: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export type CreateRecallInput = z.infer<typeof createRecallSchema>;

export const createMedicalRecordSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  templateType: z.string().default('Evolução Clínica'),
  recordDate: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>;

export const createRestrictionSchema = z.object({
  foodOrSubstance: z.string().min(2, 'Alimento ou substância é obrigatório'),
  reason: z.enum(['Alergia', 'Intolerância', 'Não Gosta', 'Outra restrição']).default('Alergia'),
  status: z.enum(['Ativa', 'Inativa']).default('Ativa'),
  origin: z.string().optional().nullable(),
  observation: z.string().optional().nullable(),
});

export type CreateRestrictionInput = z.infer<typeof createRestrictionSchema>;
