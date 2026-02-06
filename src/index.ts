import { createApp } from './application/app';
import { InMemoryNotificationRepository } from './infrastructure/repositories/InMemoryNotificationRepository';

const port = 3000;
const app = createApp({
  notificationRepository: new InMemoryNotificationRepository(),
});

app.listen(port, () => {
  console.log('App started!');
});
