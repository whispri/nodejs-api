import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './modules/message/message.module';
import { DatabaseModule } from './database/database.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import kafkaConfig from './common/kafka/kafka.config';
import { KafkaModule } from './common/kafka/kafka.module';
import { ChatModule } from './modules/chat/chat.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessageModule,
    ConversationModule,
    DatabaseModule,
    ConfigModule.forRoot({ load: [kafkaConfig], isGlobal: true }),
    KafkaModule,
    ChatModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ??
        'AEgQuKuIYQteQymBpMtAj6NgY4sDH9StTjnrm9jxqz506wdwACO88gAsUGpsjqQW',
      signOptions: { expiresIn: '7d' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), 
      serveRoot: '/uploads', 
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [JwtStrategy],
})
export class AppModule {}
