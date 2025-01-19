const fs = require('fs');
const fsPr = require('fs').promises;
const path = require('path');

const pathToProjectDist = path.join(__dirname, 'project-dist');
fs.mkdir(pathToProjectDist, { recursive: true }, (err) => {
    if (err) console.log(err.message);
});

const pathToStyles = path.join(__dirname, 'styles');

const pathToAssets = path.join(__dirname, 'assets');
const pathToProjectAssets = path.join(pathToProjectDist, 'assets');

async function buildPage() {
    await createTemplate();
    mergeStyles();
    copyDir(pathToAssets, pathToProjectAssets);
}

//template
async function createTemplate() {
    const pathToTemplate = path.join(__dirname, 'template.html');
    const pathToProjectTemplate = path.join(pathToProjectDist, 'index.html');

    await fsPr.copyFile(pathToTemplate, pathToProjectTemplate);
    let content = await fsPr.readFile(pathToProjectTemplate, 'utf-8');

    const pathToComponents = path.join(__dirname, 'components');
    const filesInComponents = await fsPr.readdir(pathToComponents, {
        withFileTypes: true,
    });

    filesInComponents.forEach(async (file) => {
        const pathToFile = path.join(pathToComponents, file.name);
        const fileExt = path.extname(pathToFile);

        if (file.isFile() && fileExt === '.html') {
            const fileContent = await fsPr.readFile(pathToFile, 'utf-8');
            const fileName = file.name.replace(fileExt, '');
            content = content.replace(`{{${fileName}}}`, fileContent);

            await fsPr.writeFile(pathToProjectTemplate, content);
        }
    });
}

//styles
function mergeStyles() {
    const pathToProjectStyles = path.join(pathToProjectDist, 'style.css');

    const output = fs.createWriteStream(pathToProjectStyles);

    try {
        fs.readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
            if (err) console.log(err.message);

            files.forEach((file) => {
                if (file.isFile() && path.extname(file.name) === '.css') {
                    const pathToFile = path.join(pathToStyles, file.name);
                    const input = fs.createReadStream(pathToFile, 'utf-8');
                    input.on('data', (chunk) => output.write(chunk));
                }
            });
        });
    } catch (e) {
        console.log(e.message);
    }
}

//assets
async function copyDir(from, to) {
    try {
        await fsPr.mkdir(to, { recursive: true });

        const files = await fsPr.readdir(
            from,
            { withFileTypes: true },
            (err, files) => {
                if (err) console.log(err.message);
                return files;
            },
        );
        files.forEach((file) => {
            const pathToFile = path.join(from, file.name);
            const pathToCopyFile = path.join(to, file.name);
            if (file.isDirectory()) {
                copyDir(pathToFile, pathToCopyFile);
            } else {
                fsPr.copyFile(pathToFile, pathToCopyFile);
            }
        });
    } catch (e) {
        console.log(e.message);
    }
}

buildPage();
