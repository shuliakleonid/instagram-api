import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsEmailInInDBValidator, IsLoginInDBValidator } from '../validators/register.validators';

export function IsLoginInDb(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsLoginInDBValidator,
        });
    };
}
export function IsEmailInDb(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsEmailInInDBValidator,
        });
    };
}
