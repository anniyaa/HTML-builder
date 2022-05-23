const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

async function addMessage() {
  const filePath = path.join(__dirname + '/new_text.txt');
  const writeFile = await fs.createWriteStream(filePath);
  stdout.write('Hello! Enter a massage!\n');

  stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
      stdout.write('Good bye!');
      fs.unlink(filePath, err => {
        if (err) throw err;
      });
      process.exit();
    }
    writeFile.write(data);
  });

  process.on('SIGINT', () => {
    stdout.write('Good bye!');
    fs.unlink(filePath, err => {
      if (err) throw err;
    });
    process.exit();
  });
}

addMessage();