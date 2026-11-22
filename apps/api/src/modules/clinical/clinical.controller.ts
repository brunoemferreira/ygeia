import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ClinicalService } from './clinical.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createAnamneseSchema,
  CreateAnamneseInput,
  createRecallSchema,
  CreateRecallInput,
  createMedicalRecordSchema,
  CreateMedicalRecordInput,
  createRestrictionSchema,
  CreateRestrictionInput,
} from '@ygeia/validation-schemas';

@Controller('api/v1/patients/:patientId')
@UseGuards(JwtAuthGuard)
export class ClinicalController {
  constructor(
    @Inject(ClinicalService) private readonly clinicalService: ClinicalService,
  ) {}

  // ==========================================
  // 1. ANAMNESES
  // ==========================================
  @Get('anamneses')
  async listAnamneses(@Param('patientId') patientId: string) {
    return this.clinicalService.listAnamneses(patientId);
  }

  @Post('anamneses')
  async createAnamnese(
    @Req() req: any,
    @Param('patientId') patientId: string,
    @Body(new ZodValidationPipe(createAnamneseSchema)) body: CreateAnamneseInput,
  ) {
    const tenantId = req.user.tenantId;
    return this.clinicalService.createAnamnese(tenantId, patientId, body);
  }

  @Put('anamneses/:id')
  async updateAnamnese(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() body: Partial<CreateAnamneseInput>,
  ) {
    return this.clinicalService.updateAnamnese(patientId, id, body);
  }

  @Delete('anamneses/:id')
  async deleteAnamnese(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalService.deleteAnamnese(patientId, id);
  }

  // ==========================================
  // 2. RECORDATÓRIOS ALIMENTARES
  // ==========================================
  @Get('recalls')
  async listRecalls(@Param('patientId') patientId: string) {
    return this.clinicalService.listRecalls(patientId);
  }

  @Post('recalls')
  async createRecall(
    @Req() req: any,
    @Param('patientId') patientId: string,
    @Body(new ZodValidationPipe(createRecallSchema)) body: CreateRecallInput,
  ) {
    const tenantId = req.user.tenantId;
    return this.clinicalService.createRecall(tenantId, patientId, body);
  }

  @Put('recalls/:id')
  async updateRecall(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() body: Partial<CreateRecallInput>,
  ) {
    return this.clinicalService.updateRecall(patientId, id, body);
  }

  @Delete('recalls/:id')
  async deleteRecall(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalService.deleteRecall(patientId, id);
  }

  // ==========================================
  // 3. PRONTUÁRIO & EVOLUÇÃO CLÍNICA
  // ==========================================
  @Get('medical-records')
  async listMedicalRecords(@Param('patientId') patientId: string) {
    return this.clinicalService.listMedicalRecords(patientId);
  }

  @Post('medical-records')
  async createMedicalRecord(
    @Req() req: any,
    @Param('patientId') patientId: string,
    @Body(new ZodValidationPipe(createMedicalRecordSchema)) body: CreateMedicalRecordInput,
  ) {
    const tenantId = req.user.tenantId;
    return this.clinicalService.createMedicalRecord(tenantId, patientId, body);
  }

  @Put('medical-records/:id')
  async updateMedicalRecord(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() body: Partial<CreateMedicalRecordInput>,
  ) {
    return this.clinicalService.updateMedicalRecord(patientId, id, body);
  }

  @Delete('medical-records/:id')
  async deleteMedicalRecord(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalService.deleteMedicalRecord(patientId, id);
  }

  // ==========================================
  // 4. RESTRIÇÕES ALIMENTARES
  // ==========================================
  @Get('restrictions')
  async listRestrictions(@Param('patientId') patientId: string) {
    return this.clinicalService.listRestrictions(patientId);
  }

  @Post('restrictions')
  async createRestriction(
    @Req() req: any,
    @Param('patientId') patientId: string,
    @Body(new ZodValidationPipe(createRestrictionSchema)) body: CreateRestrictionInput,
  ) {
    const tenantId = req.user.tenantId;
    return this.clinicalService.createRestriction(tenantId, patientId, body);
  }

  @Put('restrictions/:id')
  async updateRestriction(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() body: Partial<CreateRestrictionInput>,
  ) {
    return this.clinicalService.updateRestriction(patientId, id, body);
  }

  @Patch('restrictions/:id/toggle')
  async toggleRestrictionStatus(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalService.toggleRestrictionStatus(patientId, id);
  }

  @Delete('restrictions/:id')
  async deleteRestriction(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ) {
    return this.clinicalService.deleteRestriction(patientId, id);
  }
}
