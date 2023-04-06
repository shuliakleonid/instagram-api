import { Length } from 'class-validator';

export class PasswordInputModelType {
    @Length(6, 20)
    newPassword: string;
}
