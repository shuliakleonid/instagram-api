import { EmailInputModelType } from '../../dto/emailResent.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../../../common/helpers/email/email.service';
import { randomUUID } from 'crypto';
import { UserRepository } from '../../../../../bd/user/infrastructure/user.repository';
import { BadRequestException } from '@nestjs/common';

export class ResentEmailCommand {
    constructor(public inputModel: EmailInputModelType) {}
}

@CommandHandler(ResentEmailCommand)
export class ResentEmailUseCase implements ICommandHandler<ResentEmailCommand> {
    constructor(protected emailService: EmailService, protected usersRepository: UserRepository) {}
    async execute(command: ResentEmailCommand) {
        const user = await this.usersRepository.getUserByEmail(command.inputModel.email);
        if (!user)
            throw new BadRequestException([
                {
                    message: 'Incorrect Email',
                    field: 'email',
                },
            ]);
        if (user.emailConfirmation.isConfirmed === true)
            throw new BadRequestException([
                {
                    message: 'Email confirmed',
                    field: 'email',
                },
            ]);

        const newConfirmationCode = randomUUID();
        const updateUserConfirmCodeByEmail = await this.usersRepository.updateUserConfirmationCodeByEmail(command.inputModel.email, newConfirmationCode);
        if (updateUserConfirmCodeByEmail) {
            const sendEmail = await this.emailService.sendEmail(command.inputModel.email, 'Resending', newConfirmationCode);
            return sendEmail;
        } else
            throw new BadRequestException([
                {
                    message: 'Incorrect Email',
                    field: 'email',
                },
            ]);
    }
}
