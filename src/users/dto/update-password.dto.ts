import { IsNotEmpty, Matches } from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/, {
        message: '비밀번호는 8글자 이상, 최소 1개의 숫자, 문자, 특수문자($@$!%*#?&)를 포함해주세요.'
    })
    newPassword: string;
}