import { createApp } from './app';
import { InMemoryNotificationRepository } from './InMemoryNotificationRepository';

const port = 3000;
const app = createApp({
  notificationRepository: new InMemoryNotificationRepository(),
});

app.listen(port, () => {
  console.log('App started!');
});
