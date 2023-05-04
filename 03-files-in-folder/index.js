const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(secretFolder, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      if (stats.isFile()) {
        const fileName = path.parse(filePath).name;
        const fileExt = path.extname(filePath).slice(1);
        const fileSize = stats.size;
        console.log(`${fileName} - ${fileExt} - ${fileSize}b`);
      }
    });
  });
});