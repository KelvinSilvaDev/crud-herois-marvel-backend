import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager'; // Use CacheStore

import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggingService } from 'src/Loggin/logging.service';
import { Hero } from '@prisma/client';

@Injectable()
export class HeroesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore, // Mude para CacheStore
    private readonly prisma: PrismaService,
    private readonly logger: LoggingService,
  ) {}

  async create(createHeroDto: CreateHeroDto) {
    try {
      const { abilities, ...rest } = createHeroDto;
      const newHero = await this.prisma.hero.create({
        data: {
          ...rest,
          abilities: { set: abilities },
        },
      });

      this.logger.log(`Hero created with ID ${newHero.id}`);
      return newHero;
    } catch (error) {
      this.logger.error('Failed to create hero', (error as Error)?.message);
      throw error;
    }
  }

  async findAll() {
    // Tenta obter heróis do cache
    const cachedHeroes = await this.cacheManager.get<Hero[]>('heroes'); // get ainda é suportado
    if (cachedHeroes) {
      this.logger.log('Retrieved heroes from cache');
      return cachedHeroes;
    }

    // Se não estiver no cache, busca no banco de dados
    try {
      const heroes = await this.prisma.hero.findMany();
      await this.cacheManager.set('heroes', heroes, { ttl: 60 }); // set ainda é suportado
      this.logger.log('Retrieved all heroes from database');
      return heroes;
    } catch (error) {
      this.logger.error('Failed to retrieve heroes', (error as Error)?.message);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const hero = await this.prisma.hero.findUnique({ where: { id } });

      if (!hero) {
        this.logger.warn(`Hero with ID ${id} not found`);
        throw new NotFoundException(`Hero with ID ${id} not found`);
      }

      this.logger.log(`Hero with ID ${id} retrieved`);
      return hero;
    } catch (error) {
      this.logger.error(
        `Failed to find hero with ID ${id}`,
        (error as Error)?.message,
      );
      throw error;
    }
  }

  async update(id: number, updateHeroDto: UpdateHeroDto) {
    try {
      const hero = await this.prisma.hero.findUnique({ where: { id } });

      if (!hero) {
        this.logger.warn(`Hero with ID ${id} not found`);
        throw new NotFoundException(`Hero with ID ${id} not found`);
      }

      const updatedHero = await this.prisma.hero.update({
        where: { id },
        data: updateHeroDto,
      });

      this.logger.log(`Hero with ID ${id} updated`);
      return updatedHero;
    } catch (error) {
      this.logger.error(
        `Failed to update hero with ID ${id}`,
        (error as Error)?.message,
      );
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const hero = await this.prisma.hero.findUnique({ where: { id } });

      if (!hero) {
        this.logger.warn(`Hero with ID ${id} not found`);
        throw new NotFoundException(`Hero with ID ${id} not found`);
      }

      await this.prisma.hero.delete({ where: { id } });
      this.logger.log(`Hero with ID ${id} deleted`);
    } catch (error) {
      this.logger.error(
        `Failed to delete hero with ID ${id}`,
        (error as Error)?.message,
      );
      throw error;
    }
  }
}
