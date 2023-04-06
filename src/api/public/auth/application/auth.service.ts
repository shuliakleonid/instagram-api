import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../../bd/user/infrastructure/user.repository';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersRepository: UserRepository) {}

    async validateUser(email: string, password: string): Promise<string> {
        const user = await this.usersRepository.getUserByEmail(email);
        if (!user) throw new UnauthorizedException();

        if (!user.isConfirmed()) throw new UnauthorizedException();

        const result = await bcrypt.compare(password, user.accountData.password);
        if (!result) throw new UnauthorizedException();

        return user.accountData.id;
    }
}
