import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RegisterCategory } from './dto/register-category.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthUser } from 'src/common/types/auth-user.type';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Criar categoria' })
  @ApiResponse({ status: 201, description: 'Categoria criada' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: RegisterCategory, @CurrentUser() user: AuthUser) {
    return this.categoryService.createCategory(body.name, user.userId);
  }

  @ApiOperation({ summary: 'Buscar todas categorias' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: AuthUser) {
    return this.categoryService.findAll(user.userId);
  }

  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.categoryService.findById(id, user.userId);
  }

  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiResponse({ status: 200, description: 'Categoria atualizada' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() name: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, user.userId, name);
  }

  @ApiOperation({ summary: 'Excluir categoria' })
  @ApiResponse({ status: 200, description: 'Categoria excluida' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.categoryService.deleteCategory(id, user.userId);
  }
}
