import { ResendEmailValidatorD } from '../../../../common/decorators/resenEmail.decorators';
import { IsEmail, Length } from 'class-validator';

export class EmailInputModelType {
    // @ResendEmailValidatorD()
    @IsEmail({}, { message: 'Incorrect Email' })
    @Length(1, 40)
    email: string;
}
