const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const dir = path.join(__dirname, 'files');
  const newDir = path.join(__dirname, 'files-copy');
  await fs.rm(newDir, { recursive: true, force: true });
  await fs.mkdir(newDir);
  
  const files = await fs.readdir(dir);
  for (const file of files) {
    const srcPath = path.join(dir, file);
    const destPath = path.join(newDir, file);
    await fs.copyFile(srcPath, destPath);
  }
}
copyDir();
