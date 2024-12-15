import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { AuthCoreModule } from 'src/auth-core/auth-core.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AuthCoreModule, PrismaModule],
  controllers: [CompaniesController],
  providers: [CompaniesService]
})
export class CompaniesModule {}
