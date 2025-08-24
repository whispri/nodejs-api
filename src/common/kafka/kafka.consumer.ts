import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class KafkaConsumerController {
  @MessagePattern('chat-message')
  handleMessage(@Payload() message: any) {
    console.log('📥 Received from Kafka:', message);
  }
}
 