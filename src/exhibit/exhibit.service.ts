import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exhibit } from './entities/exhibit.entity';
import { Repository } from 'typeorm';
import { CreateExhibitDto } from './dtos/createExhibit.dto';
import { User } from 'src/user/entities/user.entity';
import 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { PaginatedExhibits } from './types';

@Injectable()
export class ExhibitService {
  constructor(
    @InjectRepository(Exhibit)
    private exhibitRepository: Repository<Exhibit>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /* Create a new exhibit and save uploaded file */
  createExhibit(
    file: Express.Multer.File,
    data: CreateExhibitDto,
    userId: number,
  ): Promise<Exhibit> {
    const uploadPath = path.join(__dirname, '../../../', 'uploads');

    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadPath, uniqueFileName);

      fs.writeFileSync(filePath, file.buffer);

      const exhibit = this.exhibitRepository.create({
        image: `/static/${uniqueFileName}`,
        description: data.description,
        user: { id: userId },
      });

      return this.exhibitRepository.save(exhibit);
    } catch (error) {
      console.log('Create exhibit error', error);
      throw new InternalServerErrorException('Failed to create exhibit');
    }
  }

  /* Get all exhibits with pagination */
  getAllExhibits(
    page: number,
    limit: number,
  ): Promise<PaginatedExhibits<Exhibit>> {
    return this.exhibitsPaginate(page, limit);
  }

  /* Get one exhibit by id */
  async getExhibitById(id: number): Promise<Exhibit> {
    const exhibit = await this.exhibitRepository
      .createQueryBuilder('exhibit')
      .loadRelationCountAndMap('exhibit.commentCount', 'exhibit.comments')
      .leftJoinAndSelect('exhibit.user', 'user')
      .where('exhibit.id = :id', { id })
      .getOne();

    if (!exhibit) {
      throw new NotFoundException(`Exhibit with id ${id} not found`);
    }
    return exhibit;
  }
  /* Get exhibits belonging to a specific user with pagination */
  getOwnExhibits(
    userId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedExhibits<Exhibit>> {
    return this.exhibitsPaginate(page, limit, userId);
  }

  /* Delete an exhibit by id if the requesting user is the owner */
  async deleteExhibit(id: number, userId: number): Promise<void> {
    const exhibit = await this.exhibitRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (!exhibit)
      throw new NotFoundException(`Exhibit with id ${id} not found`);
    if (exhibit.user.id !== userId)
      throw new ForbiddenException(
        "You don't have permissions to dele this exhibit.",
      );

    try {
      await this.exhibitRepository.remove(exhibit);
      this.removeFile(exhibit.image);
    } catch (error) {
      console.error('Delete error:', error);
      throw new InternalServerErrorException('Failed to delete exhibit');
    }
  }

  /* Private method to remove a file from disk */
  private removeFile(filePath: string): void {
    try {
      const filePathToRemove = path.join(__dirname, '../../../', filePath);

      if (fs.existsSync(filePathToRemove)) {
        fs.unlinkSync(filePathToRemove);
      }
    } catch (error) {
      console.error(
        `Could not remove file from disk: ${(error as Error).message}`,
      );
    }
  }

  /* Private method for paginating exhibits */
  private async exhibitsPaginate(
    page: number,
    limit: number,
    userId?: number,
  ): Promise<PaginatedExhibits<Exhibit>> {
    const queryBuilder = this.exhibitRepository.createQueryBuilder('exhibit');

    queryBuilder
      .loadRelationCountAndMap('exhibit.commentCount', 'exhibit.comments')
      .leftJoinAndSelect('exhibit.user', 'user');

    if (userId) {
      queryBuilder.where('exhibit.user.id = :userId', { userId });
    }

    const total = await queryBuilder.getCount();
    const results = await queryBuilder

      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: results,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }
}
