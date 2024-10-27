const fs = require(`fs`)
const path = require(`path`)

if (process.argv.length !== 3) {
  console.error('Expected at least one argument!');
  process.exit(1);
}

let dir = process.argv[2];
if(dir.endsWith("\""))
  dir = dir.substring(0, dir.length-1)
console.error(dir)

if( !fs.lstatSync( dir).isDirectory() ) {
  console.error('Expected at least one dir!');
  process.exit(1);
}

let rfiles = [];
let files = fs.readdirSync(dir)

for (let file of files) {
  file = dir + "\\" + file;
  rfiles.push({ name: file, ctime: fs.lstatSync(file).ctime })
}
rfiles.sort((a, b) => a.ctime - b.ctime )

let count = 0;
for (let file of rfiles) {
  let ext = path.extname(file.name);
  fs.renameSync(file.name, dir + "\\" + String(count).padStart(2,'0') + ext);
  count += 1
}
