import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Heroes')
@Controller('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new hero' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Hero created successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createHeroDto: CreateHeroDto) {
    const hero = await this.heroesService.create(createHeroDto);
    return { message: 'Hero created successfully', data: hero };
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all heroes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of heroes retrieved successfully',
  })
  async findAll() {
    const heroes = await this.heroesService.findAll();
    return { message: 'List of heroes retrieved successfully', data: heroes };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hero by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the hero' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Hero retrieved successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Hero not found' })
  async findOne(@Param('id') id: string) {
    const hero = await this.heroesService.findOne(+id);
    return { message: 'Hero retrieved successfully', data: hero };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a hero' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the hero' })
  @ApiBody({ type: UpdateHeroDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Hero updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Hero not found' })
  async update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
    const updatedHero = await this.heroesService.update(+id, updateHeroDto);
    return { message: 'Hero updated successfully', data: updatedHero };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a hero' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the hero' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Hero deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Hero not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.heroesService.remove(+id);
    return { message: 'Hero deleted successfully' };
  }
}
