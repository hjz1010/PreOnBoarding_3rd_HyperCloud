import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Post } from './post.entity';


@Controller('posts')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard())
export class PostsController {
    @Post()
    createPost(
        @Body() content: string,
        @Req() req
    ): Promise<Post> {
        return this.postsService.createPost(content, req.user);
    } 
}
