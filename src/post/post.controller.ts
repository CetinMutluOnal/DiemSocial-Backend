import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { CreatePostDto } from 'src/dto/post-dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Post()
  @FormDataRequest()
  async createPost(@Res() response, @Body() createPostDto: CreatePostDto) {
    try {
      const newPost = await this.postService.createPost(createPostDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Post created successfully',
        newPost,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Post not created',
        error: error.message,
      });
    }
  }
  @Get()
  async getAllPosts(@Res() response) {
    try {
      const allPosts = await this.postService.getAllPosts();
      return response.status(HttpStatus.OK).json({
        message: 'All Posts found successfully',
        allPosts,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
  @Get('/:id')
  async getPostById(@Res() response, @Param('id') postId: string) {
    try {
      const post = await this.postService.getPostById(postId);
      return response.status(HttpStatus.OK).json({
        message: 'Post found successfully',
        post,
      });
    } catch (error) {
      return response.status(error.status).jsons(error.status);
    }
  }
  @Delete('/:id')
  async deletePost(@Res() response, @Param('id') postId: string) {
    try {
      const deletedPost = await this.postService.deletePost(postId);
      return response.status(HttpStatus.OK).json({
        message: 'Post deleted successfully',
        deletedPost,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
}
