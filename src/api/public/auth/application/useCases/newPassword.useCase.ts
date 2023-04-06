import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordInputModelType } from '../../dto/password.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../../../../bd/user/infrastructure/user.repository';
import { BadRequestException } from '@nestjs/common';

export class NewPasswordCommand {
    constructor(public inputModel: PasswordInputModelType, public code: string) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler<NewPasswordCommand> {
    constructor(protected userRepository: UserRepository) {}
    async execute(command: NewPasswordCommand) {
        const user = await this.userRepository.getUserByRecoveryCode(command.code);
        if (!user) throw new BadRequestException([{ message: 'Incorrect recoverCoda', field: 'code' }]);
        if (user.emailConfirmation.expirationData < new Date()) {
            throw new BadRequestException([{ message: 'The validity period is over', field: 'code' }]);
        }
        const newHashPassword = await bcrypt.hash(command.inputModel.newPassword, 10);
        const updateIsConfirmed = await this.userRepository.updatePasswordRecoveryCode(command.code, newHashPassword);
        if (updateIsConfirmed) {
            return true;
        }
        throw new BadRequestException([{ message: 'Incorrect recoveryCode', field: 'recoveryCode' }]);
    }
}
