import { Body, Controller, Delete, Get, Logger, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto, CreatePostingDto } from './dto/create-posting.dto';
import { Comment, Posting } from './posting.entity';
import { commentsService, PostingsService, ReactionsServices } from './postings.service';


@Controller('postings')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard())
export class PostingsController {
    private logger = new Logger('Posting')
    constructor(private postingService: PostingsService) {}

    @Post()
    createPosting(
        @Body() createPosting: CreatePostingDto,
        @Req() req
    ): Promise<Posting> {
        this.logger.verbose(`User ${req.user.email} creating a new posting.
                            Payload: ${JSON.stringify(createPosting)}`)
        return this.postingService.createPosting(createPosting.content, createPosting.state_id, req.user)
    } 

    @Get()
    getPosting(
        @Req() req,
    ): Promise<Posting[]> {
        this.logger.verbose(`User ${req.user.email} trying to get all postings.`)
        return this.postingService.getAllPostings(req.user)
    }

    @Post('/:posting_id/update')
    updatePosting(
        @Param('posting_id') posting_id : string,
        @Body() createPosting: CreatePostingDto,
        @Req() req
    ): Promise<Posting> {
        this.logger.verbose(`User ${req.user.email} trying to update the posting of #${posting_id}.
                            Payload: ${JSON.stringify(createPosting)} `)
        return this.postingService.updatePosting(posting_id, createPosting, req.user)
    }

    @Delete('/:posting_id/delete')
    deletePosting(
        @Param('posting_id') posting_id: string,
        @Req() req
    ): Promise <string> {
        this.logger.verbose(`User ${req.user.email} trying to delete the posting of #${posting_id}.`)
        return this.postingService.deletePosting(posting_id, req.user)
    }
}


@Controller('comments')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard())
export class CommentsController {
    private logger = new Logger('Comment')
    constructor(
        private commentService: commentsService
    ) {}

    @Post('/:posting_id')
    createComment(
        @Body() createCommentDto: CreateCommentDto,
        @Param('posting_id') posting_id: string,
        @Req() req
    ): Promise<Comment> {
        this.logger.verbose(`User ${req.user.email} creating a comment for the posting of #${posting_id}. 
                            Payload: ${JSON.stringify(createCommentDto)}`)
        return this.commentService.createComment(createCommentDto.text, posting_id, req.user)
    }
}

@Controller('reactions')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard())
export class ReactionsController {
    private logger = new Logger('Reaction')
    constructor(
        private reactionService: ReactionsServices
    ) {}

    @Post('/:posting_id/:emoticon_id')
    async clickReaction(
        @Param('posting_id') posting_id: string,
        @Param('emoticon_id') emoticon_id: string,
        @Req() req
    ): Promise<string> {
        this.logger.verbose(`User ${req.user.email} clicking REACTION${emoticon_id} on the posting of #${posting_id}.`)
        return this.reactionService.createOrDeleteReaction(posting_id, req.user, emoticon_id)
    }
}
