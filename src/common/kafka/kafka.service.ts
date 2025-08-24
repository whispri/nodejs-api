import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_SERVICE } from './kafka.constants';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    try {
      await this.kafkaClient.connect();
      console.log('✅ Kafka client connected');
    } catch (error) {
      console.error('❌ Kafka connection failed:', error);
    }
  }

  async send(topic: string, message: any) {
    console.log('📤 Sending to Kafka:', { topic, message });
    const result = await this.kafkaClient.emit(topic, message).toPromise();
    console.log('📤 Kafka emit result:', result);
    return result;
  }
}
