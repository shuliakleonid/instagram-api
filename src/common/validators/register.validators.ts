import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../bd/user/entities/user.schema';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsLoginInDBValidator implements ValidatorConstraintInterface {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    async validate(login: string) {
        try {
            const user = await this.userModel.findOne({
                'accountData.login': login,
            });
            if (user) return false;
            return true;
        } catch (e) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'This login already in db (User with this login is already registered)';
    }
}

@Injectable()
@ValidatorConstraint({ async: true })
export class IsEmailInInDBValidator implements ValidatorConstraintInterface {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    async validate(email: string) {
        try {
            const user = await this.userModel.findOne({
                'accountData.email': email,
            });
            if (user) return false;
            return true;
        } catch (e) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'This email already in db (User with this email is already registered)';
    }
}
