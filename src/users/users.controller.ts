import { Body, Controller, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateUserDto } from "./dto/create-user.dto";
import { FollowDto } from "./dto/follow.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { FollowsService, UsersService } from "./users.service";

@Controller('users')
@UsePipes(ValidationPipe)
export class UsersController {
    constructor(private userService : UsersService) {}

    @Post('/signup')
    createUser(@Body() createUserDto: CreateUserDto): Promise <string> {
        return this.userService.createUser(createUserDto)
    }

    @Post('/login')
    logIn(@Body() createUserDto: CreateUserDto): Promise <string> { //<{accessToken: string}>
        return this.userService.logIn(createUserDto)
    }

    @Post('/update/password')
    @UseGuards(AuthGuard())
    updatePassword(
        @Req() req, 
        @Body() updatePasswordDto: UpdatePasswordDto
    ): Promise <string> {
        return this.userService.updatePassword(req.user, updatePasswordDto)
    }

    @Post('/terminate')
    @UseGuards(AuthGuard())
    deleteUser(
        @Req() req,
        @Body('reason_id') reason_id: number 
    ): Promise <string> {
        return this.userService.deleteUser(req.user, reason_id)
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
        @Body() followDto: FollowDto
    ): Promise<string> {
        this.logger.verbose(`User ${req.user.email} trying to follow/unfollow ${followDto.email}`)
        return this.followService.followOrUnfollow(req.user, followDto.email)
    }
}