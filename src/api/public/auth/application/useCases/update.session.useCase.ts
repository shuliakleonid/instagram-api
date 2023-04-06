import { CommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../../../bd/user/infrastructure/session.repository';

export class UpdateSessionCommand {
    constructor(public sessionId: string) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase {
    constructor(private readonly jwtService: JwtService, private readonly sessionsRepository: SessionRepository) {}

    async execute(command: UpdateSessionCommand): Promise<boolean> {
        const session = await this.sessionsRepository.getBySessionId(command.sessionId);
        session.updateDate();
        await this.sessionsRepository.saveSession(session);

        return true;
    }
}
