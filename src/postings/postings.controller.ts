import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostingDto } from './dto/create-posting.dto';
import { Posting } from './posting.entity';
import { PostingsService } from './postings.service';


@Controller('postings')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard())
export class PostingsController {
    constructor(private postingService: PostingsService) {}

    @Post()
    createPost(
        @Body() createPosting: CreatePostingDto,
        @Req() req
    ): Promise<Posting> {
        return this.postingService.createPosting(createPosting.content, req.user)
    } 
}
