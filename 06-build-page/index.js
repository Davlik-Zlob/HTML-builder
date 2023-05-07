(async function() {
  const fs = require('fs').promises;
  const path = require('path');
  
  const projectPath = path.join(__dirname, 'project-dist');
  await fs.rm(projectPath, { recursive: true, force: true });
  await fs.mkdir(projectPath);
  
  const template = path.join(__dirname, 'template.html');
  const stylesDir = path.join(__dirname, 'styles');
  const assets = path.join(__dirname, 'assets');
  
  async function buildPage() {
    let templateData = await fs.readFile(template, 'utf-8');
    const tags = templateData.match(/{{([^{}]+)}}/g)
      .map(tag => tag.slice(2, -2));
    for (const tag of tags) {
      const componentPath = path.join(__dirname, 'components', `${tag}.html`);
      const componentData = await fs.readFile(componentPath, 'utf-8');
      templateData = templateData.replace(`{{${tag}}}`, componentData);
    }
    const indexPath = path.join(__dirname, 'project-dist', 'index.html');
    await fs.writeFile(indexPath, templateData);
  }
  buildPage();
  
  async function createBundle() {
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
    const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
    await fs.writeFile(bundlePath, stylesArr.join('\n'));
  }
  createBundle();
  
  async function copyAssets(source, destination) {
    const files = await fs.readdir(source, { withFileTypes: true });
    for (const file of files) {
      const srcPath = path.join(source, file.name);
      const destPath = path.join(destination, file.name);
      if (file.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        await copyAssets(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  const newAssets = path.join(__dirname, 'project-dist', 'assets');
  await fs.mkdir(newAssets, { recursive: true });
  await copyAssets(assets, newAssets);  
})();
