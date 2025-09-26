import { Module } from '@nestjs/common';
import { TitleController } from '../controllers/title.controller';
import { TitleRepository } from '../../infra/repositories/title.repository';
import { PrismaService } from '../../infra/database/prisma.service';
import { NotificationModule } from './notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [TitleController],
  providers: [TitleRepository, PrismaService],
  exports: [TitleRepository],
})
export class TitleModule {}