const fs = require('fs/promises');
const path = require('path');

async function copyFiles() {
  const filePath = path.join(__dirname + '/files-copy');
  await fs.mkdir(filePath, {recursive:true});

  const readDir = await fs.readdir(filePath, {withFileTypes: true});
  readDir.forEach(f=>{
    const fPath = path.join(__dirname + '/files-copy/' + f.name);
    fs.unlink(fPath, err => {
      if (err) throw err;
    });
  });

  const copyDir = await fs.readdir(path.join(__dirname + '/files') );
  copyDir.forEach(f=>{
    fs.writeFile(path.join(__dirname + '/files-copy/' + f), '').then(
      fs.copyFile(path.join(__dirname + '/files/' + f), path.join(__dirname + '/files-copy/' + f))
    );
  });

}

copyFiles();