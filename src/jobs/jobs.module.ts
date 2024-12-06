import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthCoreModule } from 'src/auth-core/auth-core.module';

@Module({
  imports: [PrismaModule, AuthCoreModule],
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule {}
