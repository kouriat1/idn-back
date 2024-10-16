import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());

  console.log(process.env.API_PORT)

  await app.listen(process.env.API_PORT);


  

}
bootstrap();
