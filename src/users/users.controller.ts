import { Body, Controller, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateUserDto } from "./dto/create-user.dto";
import { FollowsService, UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private userService : UsersService) {}

    @Post('/signup')
    @UsePipes(ValidationPipe)
    createUser(@Body() createUserDto: CreateUserDto): Promise <string> {
        return this.userService.createUser(createUserDto)
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    logIn(@Body() createUserDto: CreateUserDto): Promise <string> { //<{accessToken: string}>
        return this.userService.logIn(createUserDto)
    }
}

@Controller('follows')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard())
export class FollowsController {
    private logger = new Logger('Follow')
    constructor(
        private followService: FollowsService,
    ) {}

    @Post()
    clickFollow(
        @Req() req,
        @Body('email')  email: string
    ): Promise<string> {
        this.logger.verbose(`User ${req.user.email} trying to follow/unfollow ${email}`)
        return this.followService.followOrUnfollow(req.user, email)
    }
}