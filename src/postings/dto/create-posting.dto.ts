import { IsNotEmpty, MaxLength } from "class-validator";

export class CreatePostingDto {
    @IsNotEmpty()
    @MaxLength(100)
    content: string;
}


/*
export class CreateUserDto {
    @IsNotEmpty()
    @Matches(/^[a-z0-9\.\-_]+@([a-z0-9\-]+\.)+[a-z]{2,6}$/, {
        message: '올바른 이메일을 입력해주세요.'
    })
    email: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/, {
        message: '비밀번호는 8글자 이상, 최소 1개의 숫자, 문자, 특수문자($@$!%*#?&)를 포함해주세요.'
    })
    password: string;
}*/
