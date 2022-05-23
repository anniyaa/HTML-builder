const fs = require('fs/promises');
const path = require('path');
const fss = require('fs');

async function cssBundle() {
  const cssFilePath = path.join(__dirname + '/styles');
  const readDir = await fs.readdir(cssFilePath);

  const bundlePath = path.join(__dirname + '/project-dist/');
  await fs.writeFile(bundlePath+'bundle.css', '');

  const combine_css = new Promise((resolve) => {
    const combain_styles = [];

    readDir.forEach(el=>{
      if (path.extname(el) === '.css') {
        const readcssFile = fss.createReadStream(__dirname + '/styles/' + el);
        readcssFile.on('data', (chunk => {
          combain_styles.push(chunk.toString());
        }));
        readcssFile.on('end', ()=> {
          resolve(combain_styles);
        });


      }
    });
  });

  combine_css.then((arr)=> {
    const writecss = fss.createWriteStream(bundlePath + 'bundle.css');

    arr.forEach(str=>{
      writecss.write(str);
    });
  });


}
cssBundle();