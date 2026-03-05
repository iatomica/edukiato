import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
    imports: [DbModule],
    controllers: [MessagesController],
    providers: [MessagesService],
})
export class MessagesModule {}
