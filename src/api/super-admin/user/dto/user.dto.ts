import { IsEmail, IsString, Length } from 'class-validator';
import { IsEmailInDb, IsLoginInDb } from '../../../../common/decorators/register.decorators';
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserInputModelType {
    // @IsLoginInDb()
    // @Length(3, 10)
    // @IsString()
    // login: string;

    @ApiProperty()
    @Length(6, 20)
    @IsString()
    password: string;

    @ApiProperty()
    @IsEmailInDb()
    @IsEmail({}, { message: 'Incorrect Email' })
    @Length(1, 40)
    email: string;
}
