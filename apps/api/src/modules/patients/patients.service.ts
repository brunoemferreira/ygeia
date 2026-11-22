import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface CreatePatientInput {
  fullName: string;
  birthDate?: string;
  biologicalSex?: 'FEMALE' | 'MALE';
  assignedSexAtBirth?: string;
  genderIdentity?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  guardianName?: string;
  guardianCpf?: string;
  welcomeEmail?: boolean;
  welcomeWhatsapp?: boolean;
  treatmentGoals?: string;
  insurancePlan?: string;
  locationName?: string;
  fullAddress?: string;
  notes?: string;
  photoUrl?: string;
}

export interface PatientResponse {
  id: string;
  tenantId: string;
  fullName: string;
  initials: string;
  birthDate?: string;
  biologicalSex: string;
  assignedSexAtBirth?: string;
  genderIdentity?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  guardianName?: string;
  guardianCpf?: string;
  welcomeEmail: boolean;
  welcomeWhatsapp: boolean;
  status: string;
  photoUrl?: string;
  treatmentGoals?: string;
  insurancePlan?: string;
  locationName?: string;
  fullAddress?: string;
  notes?: string;
  createdAt: string;
}

@Injectable()
export class PatientsService {
  constructor(
    @Inject(DatabaseService) private readonly db: DatabaseService,
  ) {}

  private extractInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return 'PA';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  async listPatients(tenantId: string, search?: string): Promise<PatientResponse[]> {
    let query = `
      SELECT id, tenant_id as "tenantId", full_name as "fullName",
             birth_date as "birthDate", biological_sex as "biologicalSex",
             assigned_sex_at_birth as "assignedSexAtBirth", gender_identity as "genderIdentity",
             email, phone, cpf, guardian_name as "guardianName", guardian_cpf as "guardianCpf",
             welcome_email as "welcomeEmail", welcome_whatsapp as "welcomeWhatsapp",
             status, photo_url as "photoUrl", treatment_goals as "treatmentGoals",
             insurance_plan as "insurancePlan", location_name as "locationName",
             full_address as "fullAddress", notes, created_at as "createdAt"
      FROM patients
      WHERE tenant_id = $1
    `;
    const params: any[] = [tenantId];

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND (LOWER(full_name) LIKE $2 OR LOWER(email) LIKE $2 OR cpf LIKE $2)`;
    }

    query += ` ORDER BY full_name ASC`;

    const res = await this.db.query(query, params);
    return res.rows.map((row) => ({
      ...row,
      initials: this.extractInitials(row.fullName),
    }));
  }

  async createPatient(tenantId: string, input: CreatePatientInput): Promise<PatientResponse> {
    if (!input.fullName || !input.fullName.trim()) {
      throw new BadRequestException('O nome completo do paciente é obrigatório.');
    }

    const res = await this.db.query(
      `INSERT INTO patients (
         tenant_id, full_name, birth_date, biological_sex,
         assigned_sex_at_birth, gender_identity, email, phone, cpf,
         guardian_name, guardian_cpf, welcome_email, welcome_whatsapp,
         status, photo_url, treatment_goals, insurance_plan,
         location_name, full_address, notes
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'ACTIVE', $14, $15, $16, $17, $18, $19)
       RETURNING id, tenant_id as "tenantId", full_name as "fullName",
                 birth_date as "birthDate", biological_sex as "biologicalSex",
                 assigned_sex_at_birth as "assignedSexAtBirth", gender_identity as "genderIdentity",
                 email, phone, cpf, guardian_name as "guardianName", guardian_cpf as "guardianCpf",
                 welcome_email as "welcomeEmail", welcome_whatsapp as "welcomeWhatsapp",
                 status, photo_url as "photoUrl", treatment_goals as "treatmentGoals",
                 insurance_plan as "insurancePlan", location_name as "locationName",
                 full_address as "fullAddress", notes, created_at as "createdAt"`,
      [
        tenantId,
        input.fullName.trim(),
        input.birthDate || null,
        input.biologicalSex || 'FEMALE',
        input.assignedSexAtBirth || null,
        input.genderIdentity || null,
        input.email?.trim() || null,
        input.phone?.trim() || null,
        input.cpf?.trim() || null,
        input.guardianName?.trim() || null,
        input.guardianCpf?.trim() || null,
        input.welcomeEmail ?? true,
        input.welcomeWhatsapp ?? true,
        input.photoUrl || null,
        input.treatmentGoals || null,
        input.insurancePlan || null,
        input.locationName || null,
        input.fullAddress || null,
        input.notes || null,
      ],
    );

    const created = res.rows[0];
    return {
      ...created,
      initials: this.extractInitials(created.fullName),
    };
  }

  async getPatient(tenantId: string, patientId: string): Promise<PatientResponse> {
    const res = await this.db.query(
      `SELECT id, tenant_id as "tenantId", full_name as "fullName",
              birth_date as "birthDate", biological_sex as "biologicalSex",
              assigned_sex_at_birth as "assignedSexAtBirth", gender_identity as "genderIdentity",
              email, phone, cpf, guardian_name as "guardianName", guardian_cpf as "guardianCpf",
              welcome_email as "welcomeEmail", welcome_whatsapp as "welcomeWhatsapp",
              status, photo_url as "photoUrl", treatment_goals as "treatmentGoals",
              insurance_plan as "insurancePlan", location_name as "locationName",
              full_address as "fullAddress", notes, created_at as "createdAt"
       FROM patients
       WHERE id = $1 AND tenant_id = $2
       LIMIT 1`,
      [patientId, tenantId],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    const row = res.rows[0];
    return {
      ...row,
      initials: this.extractInitials(row.fullName),
    };
  }

  async updatePatient(
    tenantId: string,
    patientId: string,
    input: Partial<CreatePatientInput>,
  ): Promise<PatientResponse> {
    const existing = await this.db.query(
      'SELECT id FROM patients WHERE id = $1 AND tenant_id = $2 LIMIT 1',
      [patientId, tenantId],
    );

    if (existing.rows.length === 0) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    const res = await this.db.query(
      `UPDATE patients
       SET full_name = COALESCE($1, full_name),
           birth_date = COALESCE($2, birth_date),
           biological_sex = COALESCE($3, biological_sex),
           assigned_sex_at_birth = COALESCE($4, assigned_sex_at_birth),
           gender_identity = COALESCE($5, gender_identity),
           email = COALESCE($6, email),
           phone = COALESCE($7, phone),
           cpf = COALESCE($8, cpf),
           guardian_name = COALESCE($9, guardian_name),
           guardian_cpf = COALESCE($10, guardian_cpf),
           welcome_email = COALESCE($11, welcome_email),
           welcome_whatsapp = COALESCE($12, welcome_whatsapp),
           treatment_goals = COALESCE($13, treatment_goals),
           insurance_plan = COALESCE($14, insurance_plan),
           location_name = COALESCE($15, location_name),
           full_address = COALESCE($16, full_address),
           notes = COALESCE($17, notes),
           photo_url = COALESCE($18, photo_url),
           updated_at = NOW()
       WHERE id = $19 AND tenant_id = $20
       RETURNING id, tenant_id as "tenantId", full_name as "fullName",
                 birth_date as "birthDate", biological_sex as "biologicalSex",
                 assigned_sex_at_birth as "assignedSexAtBirth", gender_identity as "genderIdentity",
                 email, phone, cpf, guardian_name as "guardianName", guardian_cpf as "guardianCpf",
                 welcome_email as "welcomeEmail", welcome_whatsapp as "welcomeWhatsapp",
                 status, photo_url as "photoUrl", treatment_goals as "treatmentGoals",
                 insurance_plan as "insurancePlan", location_name as "locationName",
                 full_address as "fullAddress", notes, created_at as "createdAt"`,
      [
        input.fullName?.trim() || null,
        input.birthDate || null,
        input.biologicalSex || null,
        input.assignedSexAtBirth || null,
        input.genderIdentity || null,
        input.email?.trim() || null,
        input.phone?.trim() || null,
        input.cpf?.trim() || null,
        input.guardianName?.trim() || null,
        input.guardianCpf?.trim() || null,
        input.welcomeEmail !== undefined ? input.welcomeEmail : null,
        input.welcomeWhatsapp !== undefined ? input.welcomeWhatsapp : null,
        input.treatmentGoals || null,
        input.insurancePlan || null,
        input.locationName || null,
        input.fullAddress || null,
        input.notes || null,
        input.photoUrl || null,
        patientId,
        tenantId,
      ],
    );

    const updated = res.rows[0];
    return {
      ...updated,
      initials: this.extractInitials(updated.fullName),
    };
  }
}
