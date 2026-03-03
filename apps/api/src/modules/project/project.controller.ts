import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { CreateProjectSchema, UpdateProjectSchema } from './project.schema';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPublishedList() {
    const projects = await this.projectService.getPublishedList();
    return { data: projects, message: 'Projetos obtidos com sucesso.' };
  }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getAllProjects() {
    const projects = await this.projectService.getAll();
    return { data: projects, message: 'Projetos obtidos com sucesso.' };
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getProjectDetail(@Param('slug') slug: string) {
    const project = await this.projectService.getPublishedDetail(slug);
    return { data: project, message: 'Projeto obtido com sucesso.' };
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('type') type: string) {
    if (!file) throw new BadRequestException('Arquivo não enviado.');

    const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException('Formato inválido. Use JPG, PNG ou WebP.');
    }

    const folder = type === 'banner' ? 'banners' : 'screenshots';
    const url = await this.projectService.uploadFile(
      file.buffer,
      file.mimetype,
      file.originalname,
      folder,
    );
    return { data: { url }, message: 'Arquivo enviado com sucesso.' };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(FirebaseAuthGuard)
  async createProject(@Body() body: unknown) {
    const result = CreateProjectSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ');
      throw new BadRequestException(message);
    }
    const project = await this.projectService.createProject(result.data);
    return { data: project, message: 'Projeto criado com sucesso.' };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async updateProject(@Param('id') id: string, @Body() body: unknown) {
    const result = UpdateProjectSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ');
      throw new BadRequestException(message);
    }
    const project = await this.projectService.updateProject(id, result.data);
    return { data: project, message: 'Projeto atualizado com sucesso.' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(FirebaseAuthGuard)
  async deleteProject(@Param('id') id: string) {
    await this.projectService.deleteProject(id);
  }
}
