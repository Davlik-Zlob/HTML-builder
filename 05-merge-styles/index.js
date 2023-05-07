const fs = require('fs').promises;
const path = require('path');

async function createBundle() {
  const stylesDir = path.join(__dirname, 'styles');
  const stylesArr = [];
  const files = await fs.readdir(stylesDir);
  for (const file of files) {
    const filePath = path.join(stylesDir, file);
    const stat = await fs.stat(filePath);
    if (stat.isFile() && path.extname(filePath) === '.css') {
      const cssData = await fs.readFile(filePath, 'utf-8');
      stylesArr.push(cssData);
    }
  }
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  await fs.rm(bundlePath, { recursive: true, force: true });
  await fs.writeFile(bundlePath, stylesArr.join('\n'));
}
createBundle();
