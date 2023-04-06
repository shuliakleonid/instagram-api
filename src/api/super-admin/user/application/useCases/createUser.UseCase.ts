import * as bcrypt from 'bcrypt';
import { CreateUserInputModelType } from '../../dto/user.dto';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../../../common/helpers/email/email.service';
import { UserRepository } from '../../../../../bd/user/infrastructure/user.repository';

export class CreateUserCommand {
    constructor(public inputModel: CreateUserInputModelType) {}
}

@CommandHandler(CreateUserCommand)
export class createUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(protected emailService: EmailService, protected usersRepository: UserRepository) {}
    async execute(command: CreateUserCommand) {
        const passwordHash = await this._generateHash(command.inputModel.password);
        const newUser = {
            accountData: {
                id: new Date().valueOf().toString(),
                // login: command.inputModel.login,
                email: command.inputModel.email,
                password: passwordHash,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation: {
                confirmationCode: randomUUID(),
                recoveryCode: randomUUID(),
                expirationData: add(new Date(), { hours: 2 }),
                isConfirmed: false,
            },
        };
        const sendEmail = await this.emailService.sendEmail(newUser.accountData.email, 'Registr', newUser.emailConfirmation.confirmationCode);
        if (!sendEmail) {
            throw new BadRequestException([
                {
                    message: 'Incorrect Email',
                    field: 'email',
                },
            ]);
        }
        const result = await this.usersRepository.createUser({ ...newUser });
        if (!result)
            throw new BadRequestException({
                message: 'Bad',
                field: 'login or Password',
            });
        return {
            id: result.accountData.id,
            login: result.accountData.login,
            email: result.accountData.email,
            createdAt: result.accountData.createdAt,
        };
    }
    _generateHash(password: string) {
        return bcrypt.hash(password, 10);
    }
}
