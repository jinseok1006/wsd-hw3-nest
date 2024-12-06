// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}