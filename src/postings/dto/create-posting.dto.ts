import { IsNotEmpty, MaxLength } from "class-validator";

export class CreatePostingDto {
    @IsNotEmpty()
    @MaxLength(100)
    content: string;
    state_id: number;
}

export class CreateCommentDto {
    @IsNotEmpty()
    @MaxLength(20)
    text: string;
}