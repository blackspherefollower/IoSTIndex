const { exec } = require('child_process');
const fs = require('fs');

exec('find src/data/devices -name "*.webp"', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }
  let files = stdout.split("\n")
files.forEach( f => {
exec(`identify "${f}"`, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }
console.log(stdout)
  if(stdout.includes("JPEG")){
fs.renameSync(f, f.replace(".webp",".jpeg"))
} else if(stdout.includes("PNG")){
fs.renameSync(f, f.replace(".webp",".png"))
} else if(stdout.includes("WEBP")) {
exec(`dwebp "${f}" -o "${f.replace(".webp",".png")}"`, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }
console.log(stdout, stderr)
});
}

});
})
});