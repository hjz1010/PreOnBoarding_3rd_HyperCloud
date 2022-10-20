import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./uer.entity";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private userService : UsersService) {}

    @Post('/signup')
    @UsePipes(ValidationPipe)
    createUser(@Body() createUserDto: CreateUserDto): Promise <User> {
        return this.userService.createUser(createUserDto)
    }
}