import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  CreateAnamneseInput,
  CreateRecallInput,
  CreateMedicalRecordInput,
  CreateRestrictionInput,
} from '@ygeia/validation-schemas';

@Injectable()
export class ClinicalService {
  constructor(
    @Inject(DatabaseService) private readonly db: DatabaseService,
  ) {}

  // ==========================================
  // 1. ANAMNESES CLÍNICAS
  // ==========================================
  async listAnamneses(patientId: string) {
    const res = await this.db.query(
      `
      SELECT id, patient_id as "patientId", title, template_type as "templateType",
             record_date as "date", content_html as "contentHtml", sections,
             created_at as "createdAt", updated_at as "updatedAt"
      FROM patient_anamneses
      WHERE patient_id = $1
      ORDER BY record_date DESC
      `,
      [patientId],
    );
    return res.rows;
  }

  async createAnamnese(tenantId: string, patientId: string, input: CreateAnamneseInput) {
    const res = await this.db.query(
      `
      INSERT INTO patient_anamneses (
        tenant_id, patient_id, title, template_type, record_date, content_html, sections
      ) VALUES ($1, $2, $3, $4, COALESCE($5::timestamptz, NOW()), $6, $7)
      RETURNING id, patient_id as "patientId", title, template_type as "templateType",
                record_date as "date", content_html as "contentHtml", sections,
                created_at as "createdAt", updated_at as "updatedAt"
      `,
      [
        tenantId,
        patientId,
        input.title,
        input.templateType || 'Seções padrão',
        input.recordDate || null,
        input.contentHtml || null,
        JSON.stringify(input.sections || {}),
      ],
    );
    return res.rows[0];
  }

  async updateAnamnese(patientId: string, id: string, input: Partial<CreateAnamneseInput>) {
    const res = await this.db.query(
      `
      UPDATE patient_anamneses
      SET title = COALESCE($1, title),
          template_type = COALESCE($2, template_type),
          record_date = COALESCE($3::timestamptz, record_date),
          content_html = COALESCE($4, content_html),
          sections = COALESCE($5::jsonb, sections),
          updated_at = NOW()
      WHERE id = $6 AND patient_id = $7
      RETURNING id, patient_id as "patientId", title, template_type as "templateType",
                record_date as "date", content_html as "contentHtml", sections,
                created_at as "createdAt", updated_at as "updatedAt"
      `,
      [
        input.title || null,
        input.templateType || null,
        input.recordDate || null,
        input.contentHtml || null,
        input.sections ? JSON.stringify(input.sections) : null,
        id,
        patientId,
      ],
    );
    if (res.rowCount === 0) {
      throw new NotFoundException('Anamnese não encontrada.');
    }
    return res.rows[0];
  }

  async deleteAnamnese(patientId: string, id: string) {
    const res = await this.db.query(
      'DELETE FROM patient_anamneses WHERE id = $1 AND patient_id = $2 RETURNING id',
      [id, patientId],
    );
    if (res.rowCount === 0) {
      throw new NotFoundException('Anamnese não encontrada.');
    }
    return { success: true, id };
  }

  // ==========================================
  // 2. RECORDATÓRIOS ALIMENTARES
  // ==========================================
  async listRecalls(patientId: string) {
    const res = await this.db.query(
      `
      SELECT id, patient_id as "patientId", title, template_type as "templateType",
             record_date as "date", notes,
             created_at as "createdAt", updated_at as "updatedAt"
      FROM patient_recalls
      WHERE patient_id = $1
      ORDER BY record_date DESC
      `,
      [patientId],
    );
    return res.rows;
  }

  async createRecall(tenantId: string, patientId: string, input: CreateRecallInput) {
    const res = await this.db.query(
      `
      INSERT INTO patient_recalls (
        tenant_id, patient_id, title, template_type, record_date, notes
      ) VALUES ($1, $2, $3, $4, COALESCE($5::timestamptz, NOW()), $6)
      RETURNING id, patient_id as "patientId", title, template_type as "templateType",
                record_date as "date", notes,
                created_at as "createdAt", updated_at as "updatedAt"
      `,
      [
        tenantId,
        patientId,
        input.title,
        input.templateType || 'Recordatório 24 Horas',
        input.recordDate || null,
        input.notes || null,
      ],
    );
    return res.rows[0];
  }

  async updateRecall(patientId: string, id: string, input: Partial<CreateRecallInput>) {
    const res = await this.db.query(
      `
      UPDATE patient_recalls
      SET title = COALESCE($1, title),
          template_type = COALESCE($2, template_type),
          record_date = COALESCE($3::timestamptz, record_date),
          notes = COALESCE($4, notes),
          updated_at = NOW()
      WHERE id = $5 AND patient_id = $6
      RETURNING id, patient_id as "patientId", title, template_type as "templateType",
                record_date as "date", notes,
                created_at as "createdAt", updated_at as "updatedAt"
      `,
      [
        input.title || null,
        input.templateType || null,
        input.recordDate || null,
        input.notes || null,
        id,
        patientId,
      ],
    );
    if (res.rowCount === 0) {
      throw new NotFoundException('Recordatório alimentar não encontrado.');
    }
    return res.rows[0];
  }

  async deleteRecall(patientId: string, id: string) {
    const res = await this.db.query(
      'DELETE FROM patient_recalls WHERE id = $1 AND patient_id = $2 RETURNING id',
      [id, patientId],
    );
    if (res.rowCount === 0) {
      throw new NotFoundException('Recordatório alimentar não encontrado.');
    }
    return { success: true, id };
  }

  // ==========================================
  // 3. PRONTUÁRIO & EVOLUÇÃO CLÍNICA
  // ==========================================
  async listMedicalRecords(patientId: string) {
    const res = await this.db.query(
      `
      SELECT id, patient_id as "patientId", title, template_type as "templateType",
             record_date as "date", notes,
             created_at as "createdAt", updated_at as "updatedAt"
      FROM patient_medical_records
      WHERE patient_id = $1
      ORDER BY record_date DESC
      `,
      [patientId],
    );
    return res.rows;
  }

  async createMedicalRecord(tenantId: string, patientId: string, input: CreateMedicalRecordInput) {
    const res = await this.db.query(
      `
      INSERT INTO patient_medical_records (
        tenant_id, patient_id, title, template_type, record_date, notes
      ) VALUES ($1, $2, $3, $4, COALESCE($5::timestamptz, NOW()), $6)
      RETURNING id, patient_id as "patientId", title, template_type as "templateType",
                record_date as "date", notes,
                created_at as "createdAt", updated_at as "updatedAt"
      `,
      [
        tenantId,
        patientId,
        input.title,
        input.templateType || 'Evolução Clínica',
        input.recordDate || null,
        input.notes || null,
      ],
    );
    return res.rows[0];
  }

  async updateMedicalRecord(patientId: string, id: string, input: Partial<CreateMedicalRecordInput>) {
    const res = await this.db.query(
      `
      UPDATE patient_medical_records
      SET title = COALESCE($1, title),
          template_type = COALESCE($2, template_type),
          record_date = COALESCE($3::timestamptz, record_date),
          notes = COALESCE($4, notes),
          updated_at = NOW()
      WHERE id = $5 AND patient_id = $6
      RETURNING id, patient_id as "patientId", title, template_type as "templateType",
                record_date as "date", notes,
                created_at as "createdAt", updated_at as "updatedAt"
      `,
      [
        input.title || null,
        input.templateType || null,
        input.recordDate || null,
        input.notes || null,
        id,
        patientId,
      ],
    );
    if (res.rowCount === 0) {
      throw new NotFoundException('Registro do prontuário não encontrado.');
    }
    return res.rows[0];
  }

  async deleteMedicalRecord(patientId: string, id: string) {
    const res = await this.db.query(
      'DELETE FROM patient_medical_records WHERE id = $1 AND patient_id = $2 RETURNING id',
      [id, patientId],
    );
    if (res.rowCount === 0) {
      throw new NotFoundException('Registro do prontuário não encontrado.');
    }
    return { success: true, id };
  }

  // ==========================================
  // 4. RESTRIÇÕES ALIMENTARES
  // ==========================================
  async listRestrictions(patientId: string) {
    const res = await this.db.query(
      `
      SELECT id, patient_id as "patientId", food_or_substance as "foodOrSubstance",
             reason, status, origin, observation,
             created_at as "createdAt", updated_at as "updatedAt"
      FROM patient_restrictions
      WHERE patient_id = $1
      ORDER BY created_at DESC
      `,
      [patientId],
    );
    return res.rows;
  }

  async createRestriction(tenantId: string, patientId: string, input: CreateRestrictionInput) {
    const res = await this.db.query(
      `
      INSERT INTO patient_restrictions (
        tenant_id, patient_id, food_or_substance, reason, status, origin, observation
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, patient_id as "patientId", food_or_substance as "foodOrSubstance",
                reason, status, origin, observation,
                created_at as "createdAt", updated_at as "updatedAt"
      `,
      [
        tenantId,
        patientId,
        input.foodOrSubstance,
        input.reason || 'Alergia',
        input.status || 'Ativa',
        input.origin || null,
        input.observation || null,
      ],
    );
    return res.rows[0];
  }

  async updateRestriction(patientId: string, id: string, input: Partial<CreateRestrictionInput>) {
    const res = await this.db.query(
      `
      UPDATE patient_restrictions
      SET food_or_substance = COALESCE($1, food_or_substance),
          reason = COALESCE($2, reason),
          status = COALESCE($3, status),
          origin = COALESCE($4, origin),
          observation = COALESCE($5, observation),
          updated_at = NOW()
      WHERE id = $6 AND patient_id = $7
      RETURNING id, patient_id as "patientId", food_or_substance as "foodOrSubstance",
                reason, status, origin, observation,
                created_at as "createdAt", updated_at as "updatedAt"
      `,
      [
        input.foodOrSubstance || null,
        input.reason || null,
        input.status || null,
        input.origin || null,
        input.observation || null,
        id,
        patientId,
      ],
    );
    if (res.rowCount === 0) {
      throw new NotFoundException('Restrição alimentar não encontrada.');
    }
    return res.rows[0];
  }

  async toggleRestrictionStatus(patientId: string, id: string) {
    const res = await this.db.query(
      `
      UPDATE patient_restrictions
      SET status = CASE WHEN status = 'Ativa' THEN 'Inativa' ELSE 'Ativa' END,
          updated_at = NOW()
      WHERE id = $1 AND patient_id = $2
      RETURNING id, patient_id as "patientId", food_or_substance as "foodOrSubstance",
                reason, status, origin, observation,
                created_at as "createdAt", updated_at as "updatedAt"
      `,
      [id, patientId],
    );
    if (res.rowCount === 0) {
      throw new NotFoundException('Restrição alimentar não encontrada.');
    }
    return res.rows[0];
  }

  async deleteRestriction(patientId: string, id: string) {
    const res = await this.db.query(
      'DELETE FROM patient_restrictions WHERE id = $1 AND patient_id = $2 RETURNING id',
      [id, patientId],
    );
    if (res.rowCount === 0) {
      throw new NotFoundException('Restrição alimentar não encontrada.');
    }
    return { success: true, id };
  }
}
