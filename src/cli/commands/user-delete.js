const command = {
    description: 'Delete Urungi user',
    usage,
    argSpec: {},
    run,
};

async function run (args) {
    const [username] = args._;

    const connection = require('../../../server/config/mongoose.js')();
    const User = connection.model('User');
    const user = await User.findOne({ userName: username });

    const readline = require('readline');
    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    if (!user) {
        throw new Error(`user "${username}" does not exist`);
    } else {
        r1.question(`would you like to delete "${username}"?  y/n:  `, async (answer) => {
            if (answer === 'y') {
            // user will be deleted
                await User.deleteOne({ userName: username });
                console.log(`user "${username}" successfuly deleted`);
                r1.close();
                await connection.close();
            } else if (answer === 'n') {
            // user won't be delete
                console.log(`you have cancelled: "${username}" won't be deleted`);
                r1.close();
            } else {
            // case others
                console.log(`you have cancelled: "${username}" won't be deleted`);
                r1.close();
            }
        });
    }
}

function usage () {
    const usage =
`Usage:
    cli user-delete <username>

Examples:

    cli user-delete administrator 
`;

    return usage;
}

module.exports = command;
