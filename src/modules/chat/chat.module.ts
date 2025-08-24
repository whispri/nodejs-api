// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
// import { ChatService } from './chat.service';
// import { ChatController } from './chat.controller';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [MessageModule],
  providers: [ChatGateway],
  controllers: [],
})
export class ChatModule {}
