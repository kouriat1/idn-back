import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import {PrismaClient} from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
 
     async onModuleInit() {
          try {
               await this.$connect();
          } catch (error) {
               console.error('Erreur lors de la connexion à la base de données :', error);
          }
     }

     async enableShutdownHooks(app: INestApplication) {
          const shutdown = async () => {
               await this.$disconnect(); 
               await app.close();
               process.exit(0);
          };

          process.on('SIGINT', shutdown);
          process.on('SIGTERM', shutdown);
     }
}
