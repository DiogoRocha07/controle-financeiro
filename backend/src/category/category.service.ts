import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async createCategory(name: string, userId: string) {
    return await this.prismaService.category.create({
      data: { name, isSystem: false, userId },
    });
  }

  async findAll(userId: string) {
    return await this.prismaService.category.findMany({
      where: {
        OR: [
          {
            isSystem: true,
            hiddenCategories: {
              none: {
                userId: userId,
              },
            },
          },
          { userId },
        ],
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string, userId: string) {
    const category = await this.prismaService.category.findFirst({
      where: {
        id,
        OR: [{ isSystem: true }, { userId }],
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async updateCategory(id: string, userId: string, dto: UpdateCategoryDto) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (category.isSystem) {
      throw new UnauthorizedException(
        'Categoria do sistema não pode ser alterada',
      );
    }

    if (category.userId !== userId) {
      throw new NotFoundException('Categoria não encontrada');
    }

    await this.prismaService.category.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });

    return {
      message: `Nome alterado para: ${dto.name}`,
    };
  }

  async deleteCategory(id: string, userId: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (category.isSystem) {
      await this.prismaService.userHiddenCategory.create({
        data: {
          userId,
          categoryId: id,
        },
      });

      return {
        message: 'Categoria do sistema ocultada para o usuario',
      };
    }

    if (category.userId !== userId) {
      throw new NotFoundException('Categoria não encontrada');
    }

    await this.prismaService.category.delete({
      where: { id },
    });

    return {
      message: 'Categoria excluida com sucesso',
    };
  }
}
