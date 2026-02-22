import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/createComment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createComment(
    exhibitId: number,
    data: CreateCommentDto,
    userId: number,
  ) {
    try {
      const comment = this.commentRepository.create({
        text: data.text,
        user: { id: userId },
        exhibit: { id: exhibitId },
      });

      return await this.commentRepository.save(comment);
    } catch (error) {
      console.log('Create exhibit error', error);
      throw new InternalServerErrorException('Failed to create comment');
    }
  }

  async getAllComments(exhibitId: number) {
    try {
      return await this.commentRepository.findAndCount({
        where: { exhibit: { id: exhibitId } },
        relations: ['user'],
        order: { id: 'DESC' },
      });
    } catch (error) {
      console.log('Get comments error', error);
      throw new InternalServerErrorException('Comments failed to load');
    }
  }

  async deleteComment(exhibitId: number, commentId: number, userId: number) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId, exhibit: { id: exhibitId } },
        relations: ['user'],
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      if (comment.user.id !== userId) {
        throw new ForbiddenException('You can only delete your own comments');
      }

      return this.commentRepository.remove(comment);
    } catch (error) {
      console.error('Delete error:', error);
      throw new InternalServerErrorException('Failed to delete comment');
    }
  }
}
