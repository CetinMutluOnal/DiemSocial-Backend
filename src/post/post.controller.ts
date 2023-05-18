import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpStatus,
  Res,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { CreatePostDto } from 'src/dto/';
import { PostService } from './post.service';
import { AccessTokenGuard } from 'src/common/guards/';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @UseGuards(AccessTokenGuard)
  @Post()
  // @FormDataRequest()
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './images/post',
        filename: (req, file, cb) => {
          const fileName: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      }),
    }),
  )
  async createPost(
    @Res() response,
    @UploadedFile() file,
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ) {
    try {
      const newPost = await this.postService.createPost({
        ...createPostDto,
        userId: req.user.userId,
        media: file?.path,
      });
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
  @UseGuards(AccessTokenGuard)
  @Get('follows')
  async getUserFollowsPosts(@Request() req, @Res() response) {
    try {
      const followedUserPost = await this.postService.createPostFeed(
        req.user.userId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Post found Successfully',
        followedUserPost,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Posts Not Found',
        error: error.message,
      });
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
      return response.status(error.status).json(error.status);
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
