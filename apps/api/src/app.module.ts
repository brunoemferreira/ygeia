import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DatabaseService } from './database/database.service';
import { TenantContextService } from './common/context/tenant-context.service';
import { PasswordHasherService } from './common/security/password-hasher.service';
import { TokenService } from './common/security/token.service';
import { TenantResolutionMiddleware } from './common/middleware/tenant-resolution.middleware';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';
import { TenantsService } from './modules/tenancy/tenants.service';
import { TenantsController } from './modules/tenancy/tenants.controller';
import { AuthService } from './modules/iam/auth.service';
import { AuthController } from './modules/iam/auth.controller';
import { PatientsService } from './modules/patients/patients.service';
import { PatientsController } from './modules/patients/patients.controller';
import { ClinicalModule } from './modules/clinical/clinical.module';
import { HealthController } from './health.controller';

@Module({
  imports: [ClinicalModule],
  controllers: [HealthController, TenantsController, AuthController, PatientsController],
  providers: [
    DatabaseService,
    TenantContextService,
    PasswordHasherService,
    TokenService,
    TenantsService,
    AuthService,
    PatientsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  exports: [DatabaseService, TenantContextService, PasswordHasherService, TokenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantResolutionMiddleware).forRoutes('*');
  }
}
