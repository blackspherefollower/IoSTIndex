const git = require(`isomorphic-git`)
const fs = require(`fs`)
const diff = require(`diff-arrays-of-objects`)
const csv = require(`csv-parse/sync`)

const gitdir = __dirname + `/.git`
const dir = `/src/data/devices.csv`

function encode(string) {
  return encodeURIComponent(string)
    .replace(/%20/g, ` `)
    .replace(/%[0-9A-Fa-f]{2}/g, `_`)
}

async function getFile(oid, path) {
  const trees = await git.readTree({ fs, gitdir, oid })
  const offset = path.indexOf(`/`)
  if (offset != -1) {
    const subdir = path.substring(0, offset)
    const remainder = path.substring(offset + 1)
    const match = trees.tree.find((t) => t.path == subdir)
    if (match) {
      return await getFile(match.oid, remainder)
    } else {
      return null
    }
  }
  const match = trees.tree.find((t) => t.path == path)
  if (match) {
    return match.oid
  } else {
    return null
  }
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

async function getFileContent(commit, parent) {
  let blob1 = ``
  let blob2 = ``

  const blobsha1 = await getFile(commit, dir.substring(1))
  if (blobsha1 === null) {
    return null
  }

  if (parent !== undefined) {
    const blobsha2 = await getFile(parent, dir.substring(1))

    if (blobsha1 == blobsha2) {
      return null
    }
    if (blobsha2 !== null) {
      blob2 = new TextDecoder().decode(
        (await git.readBlob({ fs, gitdir, oid: blobsha2 })).blob
      )
    }
  }
  blob1 = new TextDecoder().decode(
    (await git.readBlob({ fs, gitdir, oid: blobsha1 })).blob
  )

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
  return diff(entries2, entries1, `path`, { updatedValues: 4 })
}

async function buildDeltaFile() {
  const deltas =
    JSON.parse(fs.readFileSync(__dirname + `/src/data/deltas.json`)) ?? []

  let since = undefined
  if (deltas.length > 0) {
    since = new Date(deltas[deltas.length - 1].date * 1000)
  }
  const commits = await git.log({
    fs,
    dir,
    gitdir,
    since,
  })

  console.log(`Found ${commits.length} commits`)
  for (const c of commits.reverse()) {
    const res = await getFileContent(c.oid, c.commit.parent[0])
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
        date: c.commit.committer.timestamp,
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
