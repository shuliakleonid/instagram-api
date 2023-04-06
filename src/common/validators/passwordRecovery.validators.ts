import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../bd/user/entities/user.schema';

@Injectable()
@ValidatorConstraint({ async: true })
export class PasswordRecoveryValidators implements ValidatorConstraintInterface {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    async validate(email: string) {
        try {
            const user = await this.userModel.findOne({
                'accountData.email': email,
            });
            return user.emailConfirmation.isConfirmed === true;
        } catch (e) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'This email not confirm';
    }
}
