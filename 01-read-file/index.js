const fs = require('fs');
const path = require('path');

async function getText() {
  const filePath = path.join(__dirname + '/text.txt');
  const readFile = await fs.createReadStream(filePath);
  readFile.on('data', (chunk => {
    console.log(chunk.toString());
  }));
}

getText();