// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { IdentityModule } from './verification/identity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    UserModule,AuthModule,IdentityModule
    
  ],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
