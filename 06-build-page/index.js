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
          console.log(template);
          resolve(template);
        }
      });


    });

    edit_template.then((temp)=>{

      writeFile.write(temp);
    });


  });

}

build_page();