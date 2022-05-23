const path = require('path');
const fs = require('fs/promises');

async function filesAbout() {
  const filePath = path.join(__dirname + '/secret-folder');
  const readDir = await fs.readdir(filePath, {withFileTypes: true});
  readDir.forEach(f=>{
    if(f.isFile()) {
      const exname = path.extname(f.name).replace('.', '');

      const fPath = path.join(filePath + '/' + f.name);

      const name = f.name.split('.')[0];

      fs.stat(fPath).then(stats=>{
        const size = (stats.size/1024).toFixed(3)+'kB';

        console.log(`${name} - ${exname} - ${size}`);
      });


      return f;
    }
  });
}

filesAbout();