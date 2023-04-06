const resStatus429 = {
    status: 429,
    description: 'More than 5 requests for 10 seconds',
};

const badRequestSchema = {
    title: 'APIResultError',
    type: 'object',
    properties: {
        errorsMessages: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        description: 'any error message',
                        example: 'incorrect email',
                    },
                    field: {
                        type: 'string',
                        description: 'it should be incorrect field from request body',
                        example: 'email',
                    },
                },
            },
        },
    },
};

const badRequestCodeConfirmSchema = {
    title: 'APIResultError',
    type: 'object',
    properties: {
        errorsMessages: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        description: 'any error message',
                        example: 'incorrect confirmedCode',
                    },
                    field: {
                        type: 'string',
                        description: 'it should be incorrect field from request body',
                        example: 'code',
                    },
                },
            },
        },
    },
};

const badRequestRecoveryCodeSchema = {
    title: 'APIResultError',
    type: 'object',
    properties: {
        errorsMessages: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        description: 'any error message',
                        example: 'incorrect recoveryCode',
                    },
                    field: {
                        type: 'string',
                        description: 'it should be incorrect field from request body',
                        example: 'recoveryCode',
                    },
                },
            },
        },
    },
};

const userTokenSchema = {
    title: 'UserTokenModel',
    type: 'object',
    properties: {
        accessToken: {
            type: 'string',
        },
    },
};

const userAuthMeSchema = {
    title: 'userAuthMeSchemaViewModel',
    type: 'object',
    properties: {
        email: {
            type: 'string',
            example: 'powerful@gmail.com',
        },
        userId: {
            type: 'string',
            example: '642b57873fd3241964fef9aa',
        },
    },
};

export const sw_authMe = {
    summary: { summary: "Get user's info. User should have access token" },
    status200: {
        status: 200,
        description: "User's info was received",
        schema: userAuthMeSchema,
    },
    status401: {
        status: 401,
        description: 'Check your cookie. Make sure that user is exist',
    },
};

export const sw_regitstration = {
    summary: { summary: 'Registration for users' },
    status204: {
        status: 204,
        description: 'Account for user was created',
    },
    status400: {
        status: 400,
        description: 'Data from request are incorrect or unexist',
        schema: badRequestSchema,
    },
    status429: resStatus429,
    inputSchema: {
        schema: {
            title: 'CreateUserInputModelType',
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'powerful@gmail.com',
                    description: 'it should be valid email',
                },
                password: {
                    type: 'string',
                    minLength: 6,
                    maxLength: 20,
                },
            },
        },
    },
};

export const sw_registrationEmailResending = {
    summary: { summary: "Send confirmation code to user's email" },
    status204: {
        status: 204,
        description: 'Email succesfully sent',
    },
    status400: {
        status: 400,
        description: "User's emaii is incorrect",
        schema: badRequestSchema,
    },
    status429: resStatus429,
    inputSchema: {
        schema: {
            title: 'EmailInputModelType',
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'powerful@gmail.com',
                    description: 'it should be valid email',
                },
            },
        },
    },
};

export const sw_login = {
    summary: { summary: 'User can login and do something into app' },
    status200: {
        status: 200,
        description: 'Successfully login and get tokens. Refresh token sent into secure cookie',
        schema: userTokenSchema,
    },
    status401: {
        status: 401,
        description: 'Email or password are incorrect',
    },
    status429: resStatus429,
    inputSchema: {
        schema: {
            title: 'LoginInputModelType',
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'powerful@gmail.com',
                    description: 'it should be valid email',
                },
                password: {
                    type: 'string',
                },
            },
        },
    },
};

export const sw_refreshToken = {
    summary: { summary: 'User can update refresh and access tokens. User should have refresh token' },
    status200: {
        status: 200,
        description: 'Tokens was successfully updated and sent to user. Refresh token sent into secure cookie',
        schema: userTokenSchema,
    },
    status401: {
        status: 401,
        description: 'Refresh token is un exist or expired',
    },
};

export const sw_registrationConfirmation = {
    summary: { summary: 'User can activate account by confirmation code' },
    status204: {
        status: 204,
        description: "User's account was activated",
    },
    status400: {
        status: 400,
        description: 'User is already activated or confirm code is incorrect/expired',
        schema: badRequestCodeConfirmSchema,
    },
    status429: resStatus429,
    inputSchema: {
        schema: {
            title: 'CodeConfirmInputModelType',
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    example: 'f0b00c17-bd4d-4113-b2c4-1a7a29124970',
                    description: 'it should be code from mail which sent to user',
                },
            },
        },
    },
};

export const sw_passwordRecoveryCode = {
    summary: { summary: 'User can request recovery code to set new password' },
    status204: {
        status: 204,
        description: "Mail with recovery code was sent to user's email",
    },
    status400: {
        status: 400,
        description: 'Incorrect email. Maybe user is un exist in app',
        schema: badRequestSchema,
    },
    status429: resStatus429,
    inputSchema: {
        schema: {
            title: 'PasswordRecoveryInputModelType',
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'powerful@gmail.com',
                    description: 'it should be valid email',
                },
            },
        },
    },
};

export const sw_newPassword = {
    summary: { summary: 'User can set new password. User should have password recovery code' },
    status204: {
        status: 204,
        description: 'New password was set to user',
    },
    status400: {
        status: 400,
        description: 'Incorrect recovery code',
        schema: badRequestRecoveryCodeSchema,
    },
    status429: resStatus429,
    inputSchema: {
        schema: {
            title: 'PasswordInputModelType',
            type: 'object',
            properties: {
                newPassword: {
                    type: 'string',
                    example: 'newPassword',
                    description: 'it should be valid password',
                    minLength: 6,
                    maxLength: 20,
                },
                recoveryCode: {
                    type: 'string',
                    example: 'f0b00c17-bd4d-4113-b2c4-1a7a29124970',
                    description: 'it should be code from mail which sent to user',
                },
            },
        },
    },
};

export const sw_logout = {
    summary: { summary: "User can logout. User should have refresh token. User's access and refresh token will be deleted" },
    status204: {
        status: 204,
        description: 'User was logout. Tokens was deleted',
    },
    status401: {
        status: 401,
        description: 'Refresh token is un exist or expired',
    },
};
