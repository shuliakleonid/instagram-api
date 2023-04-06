import { IsEmail, Length } from 'class-validator';
import { PasswordRecoveryValidator } from '../../../../common/decorators/passwordRecovery.decorator';

export class PasswordRecoveryInputModelType {
    // @PasswordRecoveryValidator()
    @IsEmail({}, { message: 'Incorrect Email' })
    @Length(1, 40)
    email: string;
}
