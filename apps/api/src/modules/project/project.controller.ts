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
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { type ProjectTranslation } from '@generated/prisma';
import { FileInterceptor } from '@nestjs/platform-express';

import { ApiResponse } from '@common/api-response';
import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { isValidLocale, resolveLocale } from '@common/locales';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  UpsertProjectTranslationSchema,
  type CreateProjectInput,
  type ProjectAdminRow,
  type ProjectDetailRow,
  type ProjectListRow,
  type ProjectTranslationRow,
  type ProjectWithRelations,
  type UpdateProjectInput,
  type UpsertProjectTranslationInput,
} from './project.schema';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPublishedList(@Query('locale') locale?: string): Promise<ApiResponse<ProjectListRow[]>> {
    const resolvedLocale = resolveLocale(locale);
    const projects = await this.projectService.getPublishedList(resolvedLocale);
    return { data: projects, message: 'Projetos obtidos com sucesso.' };
  }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getAllProjects(): Promise<ApiResponse<ProjectAdminRow[]>> {
    const projects = await this.projectService.getAll();
    return { data: projects, message: 'Projetos obtidos com sucesso.' };
  }

  @Get('admin/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getProjectById(@Param('id') id: string): Promise<ApiResponse<ProjectWithRelations>> {
    const project = await this.projectService.getById(id);
    return { data: project, message: 'Projeto obtido com sucesso.' };
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getProjectDetail(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ): Promise<ApiResponse<ProjectDetailRow>> {
    const resolvedLocale = resolveLocale(locale);
    const project = await this.projectService.getPublishedDetail(slug, resolvedLocale);
    return { data: project, message: 'Projeto obtido com sucesso.' };
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: string,
  ): Promise<ApiResponse<{ url: string }>> {
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
  async createProject(
    @Body(new ZodValidationPipe(CreateProjectSchema)) body: CreateProjectInput,
  ): Promise<ApiResponse<ProjectWithRelations>> {
    const project = await this.projectService.createProject(body);
    return { data: project, message: 'Projeto criado com sucesso.' };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async updateProject(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProjectSchema)) body: UpdateProjectInput,
  ): Promise<ApiResponse<ProjectWithRelations>> {
    const project = await this.projectService.updateProject(id, body);
    return { data: project, message: 'Projeto atualizado com sucesso.' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(FirebaseAuthGuard)
  async deleteProject(@Param('id') id: string): Promise<void> {
    await this.projectService.deleteProject(id);
  }

  @Get(':id/translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getTranslation(
    @Param('id') id: string,
    @Param('locale') locale: string,
  ): Promise<ApiResponse<ProjectTranslationRow>> {
    const translation = await this.projectService.getTranslation(id, locale);
    return { data: translation, message: 'Tradução obtida com sucesso.' };
  }

  @Put(':id/translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async upsertTranslation(
    @Param('id') id: string,
    @Param('locale') locale: string,
    @Body(new ZodValidationPipe(UpsertProjectTranslationSchema))
    body: UpsertProjectTranslationInput,
  ): Promise<ApiResponse<ProjectTranslation>> {
    if (!isValidLocale(locale)) throw new BadRequestException('Locale inválido.');
    const translation = await this.projectService.upsertTranslation(id, locale, body);
    return { data: translation, message: 'Tradução salva com sucesso.' };
  }
}
