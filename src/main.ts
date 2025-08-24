import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Kết nối Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get('kafka.clientId') || 'nestjs-client',
        brokers: configService.get<string[]>('kafka.brokers') || [
          'localhost:9092',
        ],
      },
      consumer: {
        groupId: configService.get('kafka.groupId') || 'nestjs-consumer',
      },
    },
  });

  await app.startAllMicroservices(); // <-- BẮT BUỘC để kích hoạt listener
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  console.log(`🚀 App running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
