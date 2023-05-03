const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const file = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Введите текст:\n');

stdin.on('data', data => {
  const input = data.toString().trim();
  if (input === 'exit') {
    stdout.write('До свидания!\n');
    exit();
  } else {
    file.write(input);
  }
});

process.on('SIGINT', () => {
  stdout.write('\nДо новых встреч!\n');
  file.end();
  exit();
});