import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from 'src/common/base/base.controller';
import { MessageService } from '../services/message.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaProducerService } from 'src/common/kafka/kafka.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { extname, join } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express'



@Controller('messages')
export class MessageController {
  constructor(
    protected service: MessageService,
    private readonly kafka: KafkaProducerService,

  ) {}
  @Get('/kafka')
  async kafkacc() {
    await this.kafka.send('chat-messages', {
      key: 'nestjs',
      content: 'Hello from NestJS!',
    });

    return { status: 'sent' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('with/:userId')
  async getMessagesWithUser(
    @Req() req,
    @Param('userId') otherUserId: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    const currentUserId = req.user.id;
    return this.service.getMessagesWithUser(
      currentUserId,
      otherUserId,
      Number(limit),
      Number(offset),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('with/:userId')
  async sendMessageToUser(
    @Req() req,
    @Param('userId') otherUserId: string,
    @Body('content') content: string,
  ) {
    const currentUserId = req.user.id;
    return this.service.sendMessageToUser(currentUserId, otherUserId, content);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllMessages(
    @Req() req,
    @Query('limit') limit = 50,
    @Query('offset') offset = 0,
  ) {
    try {
      const currentUserId = req.user.id;
      const data = await this.service.getAllMyMessages(
        currentUserId,
        Number(limit),
        Number(offset),
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('with/:userId/upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/messages',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async uploadMessageWithFiles(
    @Req() req,
    @Param('userId') otherUserId: string,
    @Body('content') content: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const currentUserId = req.user.id;
    return this.service.sendMessageWithAttachments(
      currentUserId,
      otherUserId,
      content || '',
      files,
    );
  }
}
