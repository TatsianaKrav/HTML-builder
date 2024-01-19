/* import { readdir } from 'node:fs/promises'; */

const fs = require('fs');
const path = require('path');
const pathToFoler = path.join(__dirname, 'secret-folder');

/* try {
  const files = await readdir(path);
  for (const file of files) console.log(file);
} catch (err) {
  console.error(err);
} */

fs.readdir(pathToFoler, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err.message);

  files.forEach((file) => {
    if (file.isFile()) {
      const pathToFile = path.join(pathToFoler, file.name);
      const fileExt = path.extname(pathToFile).replace('.', '');
      const fileName = file.name.replace('.' + fileExt, '');

      fs.stat(pathToFile, (err, stats) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log(`${fileName} - ${fileExt} - ${stats.size}mb`);
        }
      });
    }
  });
});
