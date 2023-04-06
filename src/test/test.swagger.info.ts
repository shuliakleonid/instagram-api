export const sw_deleteAllData = {
    summary: {summary: 'Delete all data from DB'},
    status204: {
        status: 204,
        description: 'DB was cleared',
    },
};

export const sw_activateUser = {
    summary: {summary: 'Activate user\'s account'},
    status204: {
        status: 204,
        description: 'User\'s account was activated',
    },
    status400: {
        status: 400,
        description: 'User\'s account is already activated or un exist',
    },
};

export const sw_getUser = {
    summary: {summary: 'Get DB user by email'},
    status200: {
        status: 200,
        description: 'Get DB user',
    },
    status404: {
        status: 404,
        description: 'User with this email is un exist',
    },
};

export const sw_getUsers = {
    summary: {summary: 'Get DB users'},
    status200: {
        status: 200,
        description: 'Get DB users',
    }
};