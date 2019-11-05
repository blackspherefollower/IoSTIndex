const { exec } = require(`child_process`)
const fs = require(`fs`)

exec(`find src/data/devices -name "*.webp"`, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.error(err)
    return
  }
  const files = stdout.split(`\n`)
  files.forEach(f => {
    exec(`identify "${f}"`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.error(err)
        return
      }
      console.log(stdout)
      if (stdout.includes(`JPEG`)) {
        fs.renameSync(f, f.replace(`.webp`, `.jpeg`))
      } else if (stdout.includes(`PNG`)) {
        fs.renameSync(f, f.replace(`.webp`, `.png`))
      } else if (stdout.includes(`WEBP`)) {
        exec(
          `dwebp "${f}" -o "${f.replace(`.webp`, `.png`)}"`,
          (err, stdout, stderr) => {
            if (err) {
              // node couldn't execute the command
              console.error(err)
              return
            }
            fs.unlinkSync(f)
            console.log(stdout, stderr)
          }
        )
      }
    })
  })
})

exec(`find src/data/devices -name "*.jfif"`, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.error(err)
    return
  }
  const files = stdout.split(`\n`)
  files.forEach(f => {
    exec(`identify "${f}"`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.error(err)
        return
      }
      console.log(stdout)
      if (stdout.includes(`JPEG`)) {
        fs.renameSync(f, f.replace(`.jfif`, `.jpeg`))
      } else if (stdout.includes(`PNG`)) {
        fs.renameSync(f, f.replace(`.jfif`, `.png`))
      } else if (stdout.includes(`WEBP`)) {
        exec(
          `dwebp "${f}" -o "${f.replace(`.jfif`, `.png`)}"`,
          (err, stdout, stderr) => {
            if (err) {
              // node couldn't execute the command
              console.error(err)
              return
            }
            fs.unlinkSync(f)
            console.log(stdout, stderr)
          }
        )
      }
    })
  })
})
