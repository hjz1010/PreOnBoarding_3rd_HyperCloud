import { IsNotEmpty, Matches } from "class-validator";

export class FollowDto {
    @IsNotEmpty()
    @Matches(/^[a-z0-9\.\-_]+@([a-z0-9\-]+\.)+[a-z]{2,6}$/, {
        message: '올바른 이메일을 입력해주세요.'
    })
    email: string;
}