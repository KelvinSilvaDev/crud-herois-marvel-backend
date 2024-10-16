import { Module } from '@nestjs/common';
import { HeroesModule } from './heroes/heroes.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggingService } from './Loggin/logging.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HeroesModule,
    PrismaModule,
    CacheModule.register({
      ttl: 5,
      max: 10,
    }),
  ],
  providers: [
    {
      provide: 'APP_LOGGER',
      useClass: LoggingService,
    },
  ],
  exports: ['APP_LOGGER'],
})
export class AppModule {}
