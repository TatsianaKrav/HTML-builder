const fs = require('fs');
const path = require('path');

const pathToProject = path.join(__dirname, 'project-dist', 'bundle.css');
const pathToStyles = path.join(__dirname, 'styles');
const output = fs.createWriteStream(pathToProject);

function merge() {
    try {
        fs.readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
            if (err) console.log(err.message);

            files.forEach((file) => {
                const pathToFile = path.join(pathToStyles, file.name);
                const fileExt = path.extname(pathToFile);
                if (file.isFile() && fileExt === '.css') {
                    const input = fs.createReadStream(pathToFile, 'utf-8');
                    input.on('data', (chunk) => output.write(chunk));
                }
            });
        });
    } catch (e) {
        console.log(e.message);
    }
}

merge();
