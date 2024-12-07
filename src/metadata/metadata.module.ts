import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthCoreModule } from 'src/auth-core/auth-core.module';

@Module({
  imports: [PrismaModule, AuthCoreModule],
  providers: [MetadataService],
  controllers: [MetadataController]
})
export class MetadataModule {}
