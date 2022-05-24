const fs = require('fs/promises');
const path = require('path');
const fss = require('fs');

async function build_page() {
  const templatePath = path.join(__dirname + '/template.html');
  let template = (await fs.readFile(templatePath)).toString();
  const comp_dir = await fs.readdir(__dirname + '/components');


  await fs.mkdir(__dirname + '/project-dist', {recursive:true});
  await fs.writeFile(path.join(__dirname + '/project-dist/' + 'index.html'), '');

  const combain_components = new Promise((resolve)=>{
    const dirs = [];
    comp_dir.map(el=>{
      dirs.push(el.split('.')[0]);
    });

    resolve(dirs);


  });

  combain_components.then((el)=>{
    fs.copyFile(templatePath, __dirname + '/project-dist/' + 'index.html');
    const writeFile = fss.createWriteStream(__dirname + '/project-dist/index.html');

    const edit_template = new Promise((resolve)=>{
      el.forEach(async (comp, ind)=>{
        let comp_file = await fs.readFile(__dirname + '/components/' + comp + '.html');

        template = template.replace(`{{${comp}}}`, comp_file.toString());

        if (!(el[ind+1])) {
          resolve(template);
        }
      });


    });

    edit_template.then((temp)=>{

      writeFile.write(temp);



      /////////////////
      async function copyFiles() {
        const assetsfilePath = path.join(__dirname + '/project-dist' + '/assets');
        await fs.mkdir(assetsfilePath, {recursive:true});


        async function recursive_assets(f) {
          await fs.readdir(path.join(__dirname + '/assets/' + f)).then(el=>{
            el.forEach(fl=>{
              fs.writeFile(path.join(__dirname + '/project-dist' + '/assets' + '/' + f + '/' + fl), '').then(
                fs.copyFile(path.join(__dirname + '/assets' + '/' + f + '/' + fl), path.join(__dirname + '/project-dist' + '/assets' + '/' + f + '/' + fl))
              );
            });
          });


        }

        const copyDir = await fs.readdir(path.join(__dirname + '/project-dist/assets') );
        copyDir.forEach( f=>{
          fs.mkdir(path.join(__dirname + '/project-dist/assets/' + f), {recursive:true});
          recursive_assets(f);
        });


      }

      copyFiles();
      ///////////////////////////






    });

  });



}

build_page();

async function cssBundle() {
  const cssFilePath = path.join(__dirname + '/styles');
  const readDir = await fs.readdir(cssFilePath);

  const bundlePath = path.join(__dirname + '/project-dist/');
  await fs.writeFile(bundlePath+'style.css', '');

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
    const writecss = fss.createWriteStream(bundlePath + 'style.css');

    arr.forEach(str=>{
      writecss.write(str);
    });

  });


}

cssBundle();


