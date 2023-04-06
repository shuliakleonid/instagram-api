import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../../../bd/user/infrastructure/user.repository';
import { BadRequestException } from '@nestjs/common';

export class RegistrationConfirmCommand {
    constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmCommand)
export class RegistrationConfirmUseCase implements ICommandHandler<RegistrationConfirmCommand> {
    constructor(protected usersRepository: UserRepository) {}
    async execute(command: RegistrationConfirmCommand) {
        const user = await this.usersRepository.getUserByConfirmationCode(command.code);
        if (user === null) throw new BadRequestException([{ message: 'Incorrect confirmationCode', field: 'code' }]);
        if (user.emailConfirmation.expirationData < new Date()) {
            throw new BadRequestException([{ message: 'The validity period is over', field: 'code' }]);
        }
        if (user?.emailConfirmation.confirmationCode !== command.code) throw new BadRequestException([{ message: 'Incorrect confirmationCode', field: 'code' }]);
        if (user?.emailConfirmation.isConfirmed === true) throw new BadRequestException([{ message: 'You email confirmed', field: 'code' }]);
        const updateIsConfirmed = await this.usersRepository.updateUserCheckConfirmCode(command.code);
        if (updateIsConfirmed) {
            return true;
        }
        throw new BadRequestException([{ message: 'Incorrect confirmedCode', field: 'code' }]);
    }
}
