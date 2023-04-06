import { ApiProperty } from '@nestjs/swagger';

export class userAuthMeSchemaViewModel {
    constructor(email: string, userId: string) {
        this.email = email;
        this.userId = userId;
    }

    @ApiProperty()
    email: string;

    @ApiProperty()
    userId: string;
}
