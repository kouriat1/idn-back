import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import { PrismaService } from 'src/prisma.service';
import { OCRService } from './oCR.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MulterModule.register({
          dest: './uploads',  // Chemin où les fichiers seront stockés temporairement
        }),
      ],
  controllers: [IdentityController],
  providers: [IdentityService, PrismaService,OCRService],
})
export class IdentityModule {}
