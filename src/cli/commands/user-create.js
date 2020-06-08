const command = {
    description: 'Create users',
    usage,
    argSpec: {},
    run,
};

async function run (args) {
    const [username] = args._;

    const connection = require('../../../server/config/mongoose.js')();
    const User = connection.model('User');
    await User.create({ userName: username, status: 0 });
    await connection.close();
}

function usage () {
    const usage =
`Usage:
    cli user-create <username> 

Examples:
    cli user-create administrator 

`;

    return usage;
}

module.exports = command;
