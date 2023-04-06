import { registerDecorator, ValidationOptions } from 'class-validator';
import { PasswordRecoveryValidators } from '../validators/passwordRecovery.validators';

export function PasswordRecoveryValidator(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: PasswordRecoveryValidators,
        });
    };
}
