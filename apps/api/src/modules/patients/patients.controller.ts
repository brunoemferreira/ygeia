import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Req,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { PatientsService, CreatePatientInput, PatientResponse } from './patients.service';
import { TenantContextService } from '../../common/context/tenant-context.service';
import { TokenService } from '../../common/security/token.service';

@Controller('api/v1/patients')
export class PatientsController {
  constructor(
    @Inject(PatientsService) private readonly patientsService: PatientsService,
    @Inject(TenantContextService) private readonly tenantContext: TenantContextService,
    @Inject(TokenService) private readonly tokenService: TokenService,
  ) {}

  private resolveTenantId(req: any): string {
    let tenantId = this.tenantContext.getTenantId() || req?.tenantId || req?.user?.tenantId;

    if (!tenantId && req?.headers?.authorization?.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = this.tokenService.verifyAccessToken(token);
        tenantId = payload.tenantId;
      } catch {}
    }

    if (!tenantId && req?.headers?.['x-tenant-id']) {
      tenantId = req.headers['x-tenant-id'] as string;
    }

    if (!tenantId) {
      throw new UnauthorizedException('Tenant não identificado na sessão ou cabeçalho.');
    }

    return tenantId;
  }

  @Get()
  async listPatients(
    @Query('search') search?: string,
    @Req() req?: any,
  ): Promise<PatientResponse[]> {
    const tenantId = this.resolveTenantId(req);
    return await this.patientsService.listPatients(tenantId, search);
  }

  @Post()
  async createPatient(
    @Body() body: CreatePatientInput,
    @Req() req?: any,
  ): Promise<PatientResponse> {
    const tenantId = this.resolveTenantId(req);
    return await this.patientsService.createPatient(tenantId, body);
  }

  @Get(':id')
  async getPatient(
    @Param('id') id: string,
    @Req() req?: any,
  ): Promise<PatientResponse> {
    const tenantId = this.resolveTenantId(req);
    return await this.patientsService.getPatient(tenantId, id);
  }

  @Put(':id')
  async updatePatient(
    @Param('id') id: string,
    @Body() body: Partial<CreatePatientInput>,
    @Req() req?: any,
  ): Promise<PatientResponse> {
    const tenantId = this.resolveTenantId(req);
    return await this.patientsService.updatePatient(tenantId, id, body);
  }
}
