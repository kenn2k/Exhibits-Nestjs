import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ExhibitService } from './exhibit.service';
import { CreateExhibitDto } from './dtos/createExhibit.dto';
import { IUser } from 'src/auth/types';
import { Request as ExpressRequest } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryExhibitDto } from './dtos/queryExhibit.dto';

interface RequestWithExhibit extends ExpressRequest {
  user: IUser;
}

@Controller('exhibits')
export class ExhibitController {
  constructor(private readonly exhibitService: ExhibitService) {}

  /* Create a new exhibit with image upload */
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Create a new exhibit.' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The exhibit have successfully created.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        description: { type: 'string' },
      },
    },
  })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithExhibit,
    @Body() data: CreateExhibitDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is not loaded.');
    }

    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException('Loaded file should be an image.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('The image size must not exceed 5 MB.');
    }

    if (!data.description || !data.description.length) {
      throw new BadRequestException('A description of the image is required.');
    }

    const exhibit = this.exhibitService.createExhibit(file, data, req.user.id);
    return exhibit;
  }

  /* Get all exhibits (public) with pagination */
  @ApiOperation({ summary: 'Get all exhibits..' })
  @ApiResponse({
    status: 200,
    description: 'Exhibits successfully received.',
  })
  @Get()
  async getAll(@Query() query: QueryExhibitDto) {
    const { page = 1, limit = 10 } = query;

    const exhibits = await this.exhibitService.getAllExhibits(page, limit);

    return exhibits;
  }

  /* Get one exhibit by its id (public) */
  @ApiOperation({ summary: 'Get exhibit by id.' })
  @ApiResponse({
    status: 200,
    description: 'Exhibit by id successfully received.',
  })
  @Get('post/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.exhibitService.getExhibitById(id);
  }

  /* Get exhibits belonging to the authenticated user with pagination */
  @UseGuards(JwtAuthGuard)
  @Get('my-posts')
  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Get own exhibits.' })
  @ApiResponse({
    status: 200,
    description: 'Own exhibits successfully received.',
  })
  @ApiQuery({ type: QueryExhibitDto })
  getAllOwn(@Query() query: QueryExhibitDto, @Req() req: RequestWithExhibit) {
    const { page = 1, limit = 10 } = query;
    return this.exhibitService.getOwnExhibits(req.user.id, page, limit);
  }

  //! @Get('static/:filename')
  //! getImage(@Param() filename: string) {}

  /* Delete an exhibit by id if owner is authenticated */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Delete exhibit by id.' })
  @ApiResponse({
    status: 200,
    description: 'Exhibit by id successfully deleted.',
  })
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithExhibit,
  ) {
    return this.exhibitService.deleteExhibit(id, req.user.id);
  }
}
