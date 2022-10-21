import { Body, Controller, Header, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUser } from "./get-user.decorator";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private userService : UsersService) {}

    @Post('/signup')
    @UsePipes(ValidationPipe)
    createUser(@Body() createUserDto: CreateUserDto): Promise <string> {
        return this.userService.createUser(createUserDto)
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    logIn(@Body() createUserDto: CreateUserDto): Promise <string> { //<{accessToken: string}>
        return this.userService.logIn(createUserDto)
    }

    // @Post('/test') // request에 담겨있는 정보를 찍어보자
    // @UsePipes(ValidationPipe)
    // @UseGuards(AuthGuard()) //토큰 유무, 유효여부를 확인해주고 담겨있는 유저정보를 가져온다.
    // test(@GetUser() user: User) {  // 생성한 커스텀 파이프 이용
    //     console.log('##### user: ', user)
    // }

    @Post()
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard())
    follow(@GetUser() user: User, @Body() following_email: string): Promise <string> {
        return this.userService.follow(user, following_email)
    }
}