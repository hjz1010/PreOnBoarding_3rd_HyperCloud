import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
