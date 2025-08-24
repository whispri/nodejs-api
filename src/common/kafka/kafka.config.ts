export default () => ({
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: process.env.KAFKA_CLIENT_ID || 'nestjs-chat',
    groupId: process.env.KAFKA_GROUP_ID || 'nestjs-group',
  },
});
