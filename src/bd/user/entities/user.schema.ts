import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate } from 'class-validator';

export type UserDocument = User & Document;

class AccountData {
    @Prop()
    id: string;
    @Prop({ type: String })
    login: string;
    @Prop({ type: String })
    password: string;
    @Prop({ type: String })
    email: string;
    @Prop()
    createdAt: string;
}
class EmailConfirmation {
    @Prop()
    confirmationCode: string;
    @Prop()
    expirationData: Date;
    @Prop()
    @IsDate()
    recoveryCode: string;
    @Prop()
    isConfirmed: boolean;
}

@Schema()
export class User {
    @Prop()
    accountData: AccountData;
    @Prop()
    emailConfirmation: EmailConfirmation;

    isConfirmed: () => boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.isConfirmed = function (): boolean {
    return this.emailConfirmation.isConfirmed === true;
};
