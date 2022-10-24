import { IsNotEmpty, MaxLength } from "class-validator";

export class CreatePostingDto {
    @IsNotEmpty()
    @MaxLength(100)
    content: string;
}
