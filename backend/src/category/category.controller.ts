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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user.type';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: RegisterCategory, @CurrentUser() user: AuthUser) {
    return this.categoryService.createCategory(body.name, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: AuthUser) {
    return this.categoryService.findAll(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.categoryService.findById(id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() name: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, user.userId, name);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.categoryService.deleteCategory(id, user.userId);
  }
}
