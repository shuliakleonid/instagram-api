import { Body, Controller, HttpCode, HttpStatus, Ip, Post, Res, UseGuards, Headers, Get } from '@nestjs/common';
import { CreateUserInputModelType } from '../../../super-admin/user/dto/user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../../super-admin/user/application/useCases/createUser.UseCase';
import { ThrottlerGuard } from '@nestjs/throttler';
import { EmailInputModelType } from '../dto/emailResent.dto';
import { ResentEmailCommand } from '../application/useCases/resentEmailUseCase';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    sw_authMe,
    sw_login,
    sw_logout,
    sw_newPassword,
    sw_passwordRecoveryCode,
    sw_refreshToken,
    sw_registrationConfirmation,
    sw_registrationEmailResending,
    sw_regitstration,
} from './auth.swagger.info';
import { LocalAuthGuard } from '../../../../common/guard/local.auth.guard';
import { JwtAdapter } from '../../../../common/helpers/jwt/jwt.adapter';
import { CurrentUser } from '../../../../common/decorators/current.user.decorator';
import { CurrentUserId } from '../../../../common/types/currentUserId';
import { Response } from 'express';
import { CreateSessionCommand } from '../application/useCases/createSessionUseCase';
import { PayloadFromRefreshToken } from '../../../../common/decorators/payload.token.decorator';
import { RefreshTokenPayloadType } from '../../../../common/types/jwt.types';
import { CookieGuard } from '../../../../common/guard/cookie.guard';
import { UpdateSessionCommand } from '../application/useCases/update.session.useCase';
import { RemoveSessionCommand } from '../application/useCases/remove.session.userCase';
import { RegistrationConfirmCommand } from '../application/useCases/registrationConfirm.useCase';
import { PasswordRecoveryInputModelType } from '../dto/passwordRecovery.dto';
import { PasswordRecoveryCodeCommand } from '../application/useCases/passwordRecovery.useCase';
import { AuthService } from '../application/auth.service';
import { PasswordInputModelType } from '../dto/password.dto';
import { NewPasswordCommand } from '../application/useCases/newPassword.useCase';
import { BearerAuthGuard } from '../../../../common/guard/bearerAuth.guard';
import { User } from '../../../../bd/user/entities/user.schema';
import { UserDecorator } from '../../../../common/decorators/user.decorator';
import { userAuthMeSchemaViewModel } from './auth.swagger.schemas';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private commandBus: CommandBus, private jwtAdapter: JwtAdapter, private authService: AuthService) {}

    @ApiBearerAuth()
    @UseGuards(BearerAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('me')
    @ApiOperation(sw_authMe.summary)
    @ApiResponse(sw_authMe.status200)
    @ApiResponse(sw_authMe.status401)
    async authMe(@UserDecorator() user: User) {
        console.log('asd');
        return { email: user.accountData.email, userId: user.accountData.id };
    }

    @UseGuards(ThrottlerGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration')
    @ApiOperation(sw_regitstration.summary)
    @ApiBody(sw_regitstration.inputSchema)
    @ApiResponse(sw_regitstration.status204)
    @ApiResponse(sw_regitstration.status400)
    @ApiResponse(sw_regitstration.status429)
    async registration(@Body() inputModel: CreateUserInputModelType) {
        return this.commandBus.execute(new CreateUserCommand(inputModel));
    }

    @UseGuards(ThrottlerGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration-confirmation')
    @ApiOperation(sw_registrationConfirmation.summary)
    @ApiBody(sw_registrationConfirmation.inputSchema)
    @ApiResponse(sw_registrationConfirmation.status204)
    @ApiResponse(sw_registrationConfirmation.status400)
    @ApiResponse(sw_registrationConfirmation.status429)
    async registrationConfirmation(@Body('code') code: string) {
        await this.commandBus.execute(new RegistrationConfirmCommand(code));
        return;
    }

    @UseGuards(ThrottlerGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration-email-resending')
    @ApiOperation(sw_registrationEmailResending.summary)
    @ApiBody(sw_registrationEmailResending.inputSchema)
    @ApiResponse(sw_registrationEmailResending.status204)
    @ApiResponse(sw_registrationEmailResending.status400)
    @ApiResponse(sw_registrationEmailResending.status429)
    async registrationEmailResending(@Body() inputModel: EmailInputModelType) {
        return this.commandBus.execute(new ResentEmailCommand(inputModel));
    }

    @UseGuards(ThrottlerGuard, LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation(sw_login.summary)
    @ApiBody(sw_login.inputSchema)
    @ApiResponse(sw_login.status200)
    @ApiResponse(sw_login.status401)
    @ApiResponse(sw_login.status429)
    async login(
        @Ip() ip: string,
        @Headers('user-agent')
        deviceName: string,
        @CurrentUser() userId: CurrentUserId,
        @Res({ passthrough: true }) response: Response,
    ) {
        const sessionId = await this.commandBus.execute(new CreateSessionCommand(userId, ip, deviceName));

        const { accessToken, refreshToken } = await this.jwtAdapter.getTokens(userId, sessionId);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
        });

        return { accessToken: accessToken };
    }

    @ApiCookieAuth()
    @UseGuards(CookieGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    @ApiOperation(sw_refreshToken.summary)
    @ApiResponse(sw_refreshToken.status200)
    @ApiResponse(sw_refreshToken.status401)
    async refreshToken(@PayloadFromRefreshToken() payload: RefreshTokenPayloadType, @Res({ passthrough: true }) response: Response) {
        await this.commandBus.execute(new UpdateSessionCommand(payload.sessionId));

        const { accessToken, refreshToken } = await this.jwtAdapter.getTokens(payload.userId, payload.sessionId);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
        });

        return { accessToken: accessToken };
    }

    @UseGuards(ThrottlerGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('password-recovery-code')
    @ApiOperation(sw_passwordRecoveryCode.summary)
    @ApiBody(sw_passwordRecoveryCode.inputSchema)
    @ApiResponse(sw_passwordRecoveryCode.status204)
    @ApiResponse(sw_passwordRecoveryCode.status400)
    @ApiResponse(sw_passwordRecoveryCode.status429)
    async passwordRecoveryCode(@Body() inputModel: PasswordRecoveryInputModelType) {
        await this.commandBus.execute(new PasswordRecoveryCodeCommand(inputModel));
        return;
    }

    @UseGuards(ThrottlerGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('new-password')
    @ApiOperation(sw_newPassword.summary)
    @ApiBody(sw_newPassword.inputSchema)
    @ApiResponse(sw_newPassword.status204)
    @ApiResponse(sw_newPassword.status400)
    @ApiResponse(sw_newPassword.status429)
    async newPassword(@Body() inputModel: PasswordInputModelType, @Body('recoveryCode') recoveryCode: string) {
        await this.commandBus.execute(new NewPasswordCommand(inputModel, recoveryCode));
        return;
    }

    @ApiCookieAuth()
    @UseGuards(CookieGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    @ApiOperation(sw_logout.summary)
    @ApiResponse(sw_logout.status204)
    @ApiResponse(sw_logout.status401)
    async logout(@PayloadFromRefreshToken() payload: RefreshTokenPayloadType, @Res({ passthrough: true }) response: Response) {
        await this.commandBus.execute(new RemoveSessionCommand(payload.sessionId));
        response.clearCookie('refreshToken');
        return;
    }
}
