import { Module } from '@nestjs/common';
import { ClinicalController } from './clinical.controller';
import { ClinicalService } from './clinical.service';
import { DatabaseService } from '../../database/database.service';
import { TenantContextService } from '../../common/context/tenant-context.service';
import { TokenService } from '../../common/security/token.service';
import { PasswordHasherService } from '../../common/security/password-hasher.service';

@Module({
  controllers: [ClinicalController],
  providers: [
    ClinicalService,
    DatabaseService,
    TenantContextService,
    TokenService,
    PasswordHasherService,
  ],
  exports: [ClinicalService],
})
export class ClinicalModule {}
