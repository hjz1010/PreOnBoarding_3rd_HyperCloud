import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto, CreatePostingDto } from './dto/create-posting.dto';
import { Comment, Posting } from './posting.entity';
import { commentsService, PostingsService } from './postings.service';


@Controller('postings')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard())
export class PostingsController {
    constructor(private postingService: PostingsService) {}

    @Post()
    createPosting(
        @Body() createPosting: CreatePostingDto,
        @Req() req
    ): Promise<Posting> {
        return this.postingService.createPosting(createPosting.content, req.user)
    } 

    @Get()
    getPosting(
        @Req() req,
    ): Promise<Posting> {
        return this.postingService.getAllPostings(req.user)
    }

    @Post('/:posting_id/update')
    updatePosting(
        @Param('posting_id') posting_id : string,
        @Body() createPosting: CreatePostingDto,
        @Req() req
    ): Promise<Posting> {
        return this.postingService.updatePosting(posting_id, createPosting.content, req.user)
    }

    @Delete('/:posting_id/delete')
    deletePosting(
        @Param('posting_id') posting_id: string,
        @Req() req
    ): Promise <string> {
        return this.postingService.deletePosting(posting_id, req.user)
    }
}


@Controller('comments')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard())
export class CommentsController {
    constructor(
        private commentService: commentsService
    ) {}

    @Post('/:posting_id')
    createComment(
        @Body() createCommentDto: CreateCommentDto,
        @Param('posting_id') posting_id: string,
        @Req() req
    ): Promise<Comment> {
        return this.commentService.createComment(createCommentDto.text, posting_id, req.user)
    }
}
