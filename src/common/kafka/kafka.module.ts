import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaProducerService } from './kafka.service';
import { KAFKA_SERVICE } from './kafka.constants';
import { KafkaConsumerController } from './kafka.consumer';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: KAFKA_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId:
                configService.get<string>('kafka.clientId') ?? 'nestjs-client',
              brokers: configService.get<string[]>('kafka.brokers') ?? [
                'localhost:9092',
              ],
            },
            consumer: {
              groupId:
                configService.get<string>('kafka.groupId') ?? 'nestjs-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
  controllers: [KafkaConsumerController],
})
export class KafkaModule {}
