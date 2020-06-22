
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

describe('user-delete', function () {
    let stdout, stdoutWriteSpy;
    let stderr, stderrWriteSpy;

    beforeAll(function () {
        stdoutWriteSpy = jest.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
            stdout += chunk;
        });
        stderrWriteSpy = jest.spyOn(process.stderr, 'write').mockImplementation((chunk) => {
            stderr += chunk;
        });
    });

    beforeEach(function () {
        stdout = '';
        stdoutWriteSpy.mockClear();
        stderr = '';
        stderrWriteSpy.mockClear();
    });

    afterAll(function () {
        stdoutWriteSpy.mockRestore();
        stderrWriteSpy.mockRestore();
    });

    describe('with --help', function () {
        it('should return 0 and display a help message', async function () {
            const exitCode = await cli.run(['user-delete', '--help']);

            expect(exitCode).toBe(0);
            const expectedOutput =
`Delete Urungi user

Usage:
    cli user-delete <username>

Examples:

    cli user-delete administrator 
`;
            expect(stdout).toBe(expectedOutput);
        });
    });

    describe('with unknown user', function () {
        it('should return 1', async function () {
            const exitCode = await cli.run(['user-delete', 'unknown']);
            expect(exitCode).toBe(1);
            expect(stderr).toMatch('user "unknown" does not exist');
        });
    });

    describe('with correct arguments', function () {
        beforeAll(async function () {
            const connection = require('../../../server/config/mongoose.js')();
            const User = connection.model('User');
            await User.create({ _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', userName: 'AA' });
            await connection.close();
        });

        it('should return 0 and delete user', async function () {
            const exitCode = await cli.run(['user-delete', 'AA']);

            expect(exitCode).toBe(0);
        });
    });
});
