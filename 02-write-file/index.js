const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
const { stdin, stdout } = process;
const os = require('node:os');
const { exit } = require('process');

stdout.write('What is your favorite movie?\n');

stdin.on('data', (info) => {
    if (info.toString() === 'exit' + os.EOL || info.toString() === 'EXIT' + os.EOL) {
        process.exit();
    } else {
        output.write(info);
    }
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Bye'));
