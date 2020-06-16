const { MongoMemoryServer } = require('mongodb-memory-server');
const cli = require('../../../src/cli');

let mongod;
beforeAll(async () => {
    mongod = new MongoMemoryServer();
    process.env.MONGODB_URI = await mongod.getConnectionString();
});
afterAll(async () => {
    await mongod.stop();
});

describe('user-create', function () {
    let stdout, stdoutWriteSpy;

    beforeAll(function () {
        stdoutWriteSpy = jest.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
            stdout += chunk;
        });
    });

    beforeEach(function () {
        stdout = '';
        stdoutWriteSpy.mockClear();
    });

    afterAll(function () {
        stdoutWriteSpy.mockRestore();
    });

    describe('with --help', function () {
        it('should return 0 and display a help message', async function () {
            const exitCode = await cli.run(['user-create', '--help']);

            expect(exitCode).toBe(0);
            const expectedOutput =
`Create users

Usage:
    cli user-create <username> 

Examples:
    cli user-create administrator 

`;

            expect(stdout).toBe(expectedOutput);
        });
    });

    describe('with correct arguments', function () {
        beforeAll(async function () {
            const connection = require('../../../server/config/mongoose.js')();
            const User = connection.model('User');
            await User.create({ userName: 'AAA' });
            await connection.close();
        });

        it('should return 0 and create users', async function () {
            const exitCode = await cli.run(['user-create', 'AAA']);

            expect(exitCode).toBe(0);
        });
    });
});
