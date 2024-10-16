import { Module } from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { HeroesController } from './heroes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggingService } from 'src/Loggin/logging.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60, // tempo de expiração em segundos
      max: 100, // número máximo de itens no cache
    }),
  ],
  controllers: [HeroesController],
  providers: [HeroesService, PrismaService, LoggingService],
  exports: [HeroesService],
})
export class HeroesModule {}
