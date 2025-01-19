const fs = require('fs').promises;
const path = require('path');

const pathFrom = path.join(__dirname, 'files');
const pathTo = path.join(__dirname, 'files-copy');

async function copyDir() {
    try {
        await fs.rm(pathTo, { recursive: true, force: true });
        await fs.mkdir(pathTo, { recursive: true });

        const files = await fs.readdir(
            pathFrom,
            { withFileTypes: true },
            (err, files) => {
                if (err) console.log(err.message);
                return files;
            },
        );
        files.forEach((file) => {
            const pathToFile = path.join(pathFrom, file.name);
            const pathToCopyFile = path.join(pathTo, file.name);
            fs.copyFile(pathToFile, pathToCopyFile);
        });
    } catch (e) {
        console.log(e.message);
    }
}

copyDir();
