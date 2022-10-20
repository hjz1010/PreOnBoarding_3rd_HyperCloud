import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
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

    @Post('login')
    @UsePipes(ValidationPipe)
    logIn(@Body() createUserDto: CreateUserDto): Promise <string> { //<{accessToken: string}>
        return this.userService.logIn(createUserDto)
    }
}