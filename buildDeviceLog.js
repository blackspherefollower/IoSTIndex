const fs = require(`fs`)
const diff = require(`diff-arrays-of-objects`)
const csv = require(`csv-parse/sync`)
const { exec } = require(`child_process`)
const ManualPromise = require(`manual-promise`).default

const dir = `src/data/devices.csv`

function encode(string) {
  return encodeURIComponent(string)
    .replace(/%20/g, ` `)
    .replace(/%[0-9A-Fa-f]{2}/g, `_`)
}

const discards = [
  `Win7`,
  `Win8`,
  `Win10 14939`,
  `Win10 15063`,
  `macOS`,
  `Linux`,
  `Android`,
  `ChromeOS`,
  `iOS`,
  `Notes`,
  `Inputs`,
  `Outputs`,
  `Detail`,
  `In Possession`,
  `Connection`,
  `Class`,
  `Anatomy`,
  `Thermometers`,
  `Pressure`,
  `Position`,
  `Camera`,
  `Buttons`,
  `Accelerometers`,
  `Camera`,
  `Estim`,
  `Grips Expanders`,
  `Heaters`,
  `Lights`,
  `Linear Actuators`,
  `Linear Actuators (Oscillating)`,
  `Linear Actuators (Positional)`,
  `Speaker`,
  `Suction`,
  `Rotators`,
  `Oscillators`,
  `Vibrators`,
  `Pump`,
  `Protocols`,
  `Buttplug Support Notes`,
  `XToys Support Notes`,
  `Affiliate Link`,
]

async function getBlob(blobSha) {
  const execDone = new ManualPromise()
  let data = ``
  exec(`git cat-file blob ${blobSha}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    data = stdout
    execDone.resolve()
  })
  await execDone
  return data
}

async function getBlobSha(commit, path) {
  const execDone = new ManualPromise()
  let data = ``
  exec(`git ls-tree --object-only ${commit} ${path}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    data = stdout.split(/$/)[0]
    execDone.resolve()
  })
  await execDone
  return data
}

async function getFileContent(commit, parent) {
  let blob1 = ``
  let blob2 = ``

  const blobsha1 = await getBlobSha(commit, dir)
  if (blobsha1 === null) {
    return null
  }

  if (parent !== undefined) {
    const blobsha2 = await getBlobSha(parent, dir)

    if (blobsha1 == blobsha2) {
      return null
    }
    if (blobsha2 !== null) {
      blob2 = await getBlob(blobsha2)
    }
  }
  blob1 = await getBlob(blobsha1)

  const entries1 = csv.parse(blob1, { columns: true }).map((e) => {
    e.path = `/devices/` + encode(e.Brand) + `/` + encode(e.Device)
    for (const prop of discards) {
      delete e[prop]
    }
    return e
  })
  const entries2 = csv.parse(blob2, { columns: true }).map((e) => {
    e.path = `/devices/` + encode(e.Brand) + `/` + encode(e.Device)
    for (const prop of discards) {
      delete e[prop]
    }
    return e
  })
  console.log(entries1.length, entries2.length)
  return diff(entries2, entries1, `path`, { updatedValues: 4 })
}

async function buildDeltaFile() {
  const deltas =
    JSON.parse(fs.readFileSync(__dirname + `/src/data/deltas.json`)) ?? []

  let since = ``
  if (deltas.length >= 1) {
    since = `--since=${deltas[deltas.length - 1].date}`
  }
  let commits = []

  const execDone = new ManualPromise()

  exec(
    `git log ${since} --format="%H %ct %P" -- ${dir}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      commits = stdout
        .split(`\n`)
        .filter((value) => value.match(/([a-f0-9]{40})/))
        .map((value) => {
          const matches = value.match(/([a-f0-9]{40}) (\d+) ([a-f0-9]{40})?/)
          return {
            commit: matches[1],
            timestamp: matches[2],
            parent: matches[3],
          }
        })
      execDone.resolve()
    }
  )
  await execDone

  console.log(`Found ${commits.length} commits`)
  for (const c of commits.reverse()) {
    const res = await getFileContent(c.commit, c.parent)
    if (
      res === null ||
      res.added.length + res.removed.length + res.updated.length === 0
    ) {
      console.log(`Skipping no-op diff`)
    } else {
      console.log(
        `Found diff: ${res.added.length} added, ${res.removed.length} removed, ${res.updated.length} updated`
      )
      deltas.push({
        date: c.timestamp,
        added: res.added,
        removed: res.removed,
        updated: res.updated,
      })
    }
  }
  fs.writeFileSync(
    __dirname + `/src/data/deltas.json`,
    JSON.stringify(deltas, null, 4)
  )
}

buildDeltaFile().finally()
