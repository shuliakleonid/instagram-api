import {SkipThrottle} from '@nestjs/throttler';
import {Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Put, Res} from "@nestjs/common";
import {UserRepository} from "../bd/user/infrastructure/user.repository";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {sw_activateUser, sw_deleteAllData, sw_getUser, sw_getUsers} from "./test.swagger.info";

@ApiTags('Testing')
@SkipThrottle()
@Controller('testing')
export class TestsController {
    constructor(protected userRepository: UserRepository) {
    };

    @HttpCode(HttpStatus.OK)
    @Get('db-user/:userEmail')
    @ApiOperation(sw_getUser.summary)
    @ApiResponse(sw_getUser.status200)
    @ApiResponse(sw_getUser.status404)
    async getUser(@Param('userEmail') userEmail: string) {
        const user = await this.userRepository.getUserByEmail(userEmail);
        if (!user) throw new NotFoundException();
        return user;
    };

    @HttpCode(HttpStatus.OK)
    @Get('db-users')
    @ApiOperation(sw_getUsers.summary)
    @ApiResponse(sw_getUsers.status200)
    async getUsers(@Param('userEmail') userEmail: string) {
        const users = await this.userRepository.getDBUsers();
        return users;
    };

    @HttpCode(HttpStatus.NO_CONTENT)
    @Put('activate-user/:userEmail')
    @ApiOperation(sw_activateUser.summary)
    @ApiResponse(sw_activateUser.status204)
    @ApiResponse(sw_activateUser.status400)
    async activateUser(@Param('userEmail') userEmail: string) {
        const user = await this.userRepository.getUserByEmail(userEmail);
        console.log(user)
        if (!user) throw new NotFoundException();
        const updateUser = await this.userRepository.activateUser(userEmail);
        console.log(updateUser)
        if (!updateUser) throw new NotFoundException();
        return;
    };

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('all-data')
    @ApiOperation(sw_deleteAllData.summary)
    @ApiResponse(sw_deleteAllData.status204)
    async deleteAllData() {
        await this.userRepository.deleteAll();
        return;
    };
};