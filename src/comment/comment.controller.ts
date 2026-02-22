import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { IUser } from 'src/auth/types';
import { Request as ExpressRequest } from 'express';
import { CreateCommentDto } from './dtos/createComment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface RequestWithComment extends ExpressRequest {
  user: IUser;
}

@Controller('exhibits/:exhibitId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /* Create a new comment for exhibit */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Create comment.' })
  @ApiResponse({
    status: 201,
    description: 'Comment successfully created.',
  })
  @Post()
  create(
    @Param('exhibitId') exhibitId: number,
    @Body() data: CreateCommentDto,
    @Req() req: RequestWithComment,
  ) {
    return this.commentService.createComment(exhibitId, data, req.user.id);
  }

  /* Get all comments by exhibitId */
  @Get()
  @ApiOperation({ summary: 'Get comments by exhibitId.' })
  @ApiResponse({
    status: 200,
    description: 'Comments by exhibitId successfully received.',
  })
  getAll(@Param('exhibitId') exhibitId: number) {
    return this.commentService.getAllComments(exhibitId);
  }

  /* Delete a comment by id if the requesting user is the owner of the comment */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Delete(':commentId')
  @ApiOperation({ summary: 'Delete your own comment.' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully.' })
  delete(
    @Param('commentId') commentId: number,
    @Param('exhibitId') exhibitId: number,
    @Req() req: RequestWithComment,
  ) {
    return this.commentService.deleteComment(exhibitId, commentId, req.user.id);
  }
}
