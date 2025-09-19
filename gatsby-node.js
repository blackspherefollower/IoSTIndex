const path = require(`path`)
const fs = require(`fs`)
const sharp = require(`sharp`)

function encode(string) {
  return encodeURIComponent(string)
    .replace(/%20/g, ` `)
    .replace(/%[0-9A-Fa-f]{2}/g, `_`)
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const markdownTemplate = path.resolve(`src/templates/markdownTemplate.js`)
  const deviceDetailTemplate = path.resolve(
    `src/templates/deviceDetailTemplate.js`
  )
  const deltaTemplate = path.resolve(`src/templates/deltaTemplate.js`)

  const result = await graphql(`
    {
      allMarkdownRemark {
        nodes {
          frontmatter {
            path
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  result.data.allMarkdownRemark.nodes.forEach((node) => {
    createPage({
      path: node.frontmatter.path,
      component: markdownTemplate,
      context: {}, // additional data can be passed via context
    })
  })

  const result2 = await graphql(`
    query {
      allDevicesCsv(sort: [{ Brand: ASC }, { Device: ASC }]) {
        edges {
          node {
            Brand
            Device
            Detail
            Availability
            Connection
            Type
            Notes
            Class
            Anatomy
            Buttplug_C_
            Buttplug_JS
            Buttplug_Rust
            Buttplug_Support_Notes
            Win10_14939
            Win10_15063
            Win7
            Win8
            iOS
            macOS
            Linux
            ChromeOS
            Android
            Thermometers
            Suction
            Speaker
            Rotators
            Pressure
            Position
            Outputs
            Grips_Expanders
            Heaters
            Inputs
            Lights
            Linear_Actuators__Positional_
            Linear_Actuators__Oscillating_
            Estim
            Camera
            Buttons
            Accelerometers
            Vibrators
            Oscillators
            Pump
            Affiliate_Link
            XToys
            XToys_Support_Notes
            In_Possession
            Has_Clones
          }
        }
      }
    }
  `)

  // Handle errors
  if (result2.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const devices = []
  result2.data.allDevicesCsv.edges.forEach((dev, i) => {
    dev = dev.node
    if (dev.Brand === `` || dev.Device === ``) {
      return
    }
    dev.id = i
    const cs = dev.Buttplug_C_.length > 0 && dev.Buttplug_C_ !== `0`
    const js = dev.Buttplug_JS.length > 0 && dev.Buttplug_JS !== `0`
    const rs = dev.Buttplug_Rust.length > 0 && dev.Buttplug_Rust !== `0`
    dev.Buttplug_CSharp = dev.Buttplug_C_
    delete dev.Buttplug_C_
    dev.ButtplugSupport = 0
    if (cs) dev.ButtplugSupport |= 1
    if (js) dev.ButtplugSupport |= 2
    if (rs) dev.ButtplugSupport |= 4

    dev.Anatomy = (dev.Anatomy === undefined ? `` : dev.Anatomy)
      .split(`,`)
      .map((a) => a.trim())
      .filter((a) => a.length > 0)

    const bpProps = [
      `ButtplugSupport`,
      `Buttplug_CSharp`,
      `Buttplug_JS`,
      `Buttplug_Rust`,
      `Buttplug_Support_Notes`,
      `Win10_14939`,
      `Win10_15063`,
      `Win7`,
      `Win8`,
      `iOS`,
      `macOS`,
      `Linux`,
      `ChromeOS`,
      `Android`,
    ]

    dev.Buttplug = {}
    bpProps.forEach((prop) => {
      dev.Buttplug[prop] = dev[prop]
      delete dev[prop]
    })

    const xtoysProps = [`XToysSupport`, `XToys_Support_Notes`]

    dev.XToysSupport = dev.XToys === `1` ? 1 : 0
    delete dev.XToys
    dev.XToys = {}
    xtoysProps.forEach((prop) => {
      dev.XToys[prop] = dev[prop]
      delete dev[prop]
    })

    const inputFeatures = [
      `Thermometers`,
      `Pressure`,
      `Position`,
      `Camera`,
      `Buttons`,
      `Accelerometers`,
    ]
    inputFeatures.sort()

    const outputFeatures = [
      [`Camera`, `Camera`],
      [`Estim`, `Estim`],
      [`Grips_Expanders`, `Grips/Expanders`],
      [`Heaters`, `Heaters`],
      [`Lights`, `Lights`],
      [`Linear_Actuators__Positional_`, `Linear Actuators (Positional)`],
      [`Linear_Actuators__Oscillating_`, `Linear Actuators (Oscillating)`],
      [`Speaker`, `Speaker`],
      [`Suction`, `Suction`],
      [`Rotators`, `Rotators`],
      [`Oscillators`, `Oscillators`],
      [`Vibrators`, `Vibrators`],
      [`Pump`, `Pump`],
    ]
    outputFeatures.sort()

    dev.Features = {
      Inputs: {},
      Outputs: {},
      InputsSummary: dev.Inputs,
      OutputsSummary: dev.Outputs,
    }
    delete dev.Inputs
    delete dev.Outputs
    inputFeatures.forEach((prop) => {
      dev.Features.Inputs[prop] = dev[prop]
      delete dev[prop]
    })
    outputFeatures.forEach((prop) => {
      dev.Features.Outputs[prop[1]] = dev[prop[0]]
      delete dev[prop[0]]
    })

    devices.push(dev)
  })

  for (const dev of devices) {
    console.log(`Processing ${dev.Brand} ${dev.Device}`)
    const brand = encode(dev.Brand)
    const device = encode(dev.Device)
    if (!fs.existsSync(`src/data/devices/${brand}`)) {
      fs.mkdirSync(`src/data/devices/${brand}`)
    }
    if (!fs.existsSync(`src/data/devices/${brand}/${device}`)) {
      fs.mkdirSync(`src/data/devices/${brand}/${device}`)
    }

    const images = await graphql(`
    query {
      allFile(filter: {relativeDirectory: {eq: "devices/${brand}/${device}"}, extension: {in: ["jpg","jpeg","png","gif","jfif","webp"]}}) {
        edges {
          node {
            relativePath
          }
        }
      }
    }`)
    dev.images = images.data.allFile.edges
      .map((e) => `/` + e.node.relativePath)
      .sort()
    if (dev.images == null) {
      dev.images = []
    }

    if (dev.images.length === 0) {
      continue
    }

    // I wish I had a better way to do this... Publish to public

    if (!fs.existsSync(`public/devices`)) {
      fs.mkdirSync(`public/devices`)
    }
    if (!fs.existsSync(`public/devices/${brand}`.toLowerCase())) {
      fs.mkdirSync(`public/devices/${brand}`.toLowerCase())
    }
    if (!fs.existsSync(`public/devices/${brand}/${device}`.toLowerCase())) {
      fs.mkdirSync(`public/devices/${brand}/${device}`.toLowerCase())
    }
    dev.images.forEach((img, i) => {
      const oimg = img.toLowerCase()

      if (!img.toLowerCase().endsWith(`.wepb`)) {
        const nimg = oimg.substring(0, img.lastIndexOf(`.`)) + `.wepb`
        const fImg = sharp(`src/data/${img}`)
        fImg
          .toFile(`public/${nimg}`)
          .then((_) => {
            dev.images[i] = nimg
          })
          .catch((err) => {
            console.error(err)
            fs.copyFileSync(`src/data/${img}`, `public/${oimg}`)
          })
      } else {
        fs.copyFileSync(`src/data/${img}`, `public/${oimg}`)
      }
    })

    if (dev.images.length > 0) {
      const fImg = sharp(`src/data/${dev.images[0]}`).resize({
        width: 100,
        height: 100,
        fit: `contain`,
        background: `#fff`,
      })
      fImg
        .metadata()
        .then(async function (metadata) {
          if (metadata.hasAlpha) {
            return sharp({
              create: {
                width: 100,
                height: 100,
                background: `#fff`,
                channels: 4,
              },
            })
              .composite([{ input: await fImg.toBuffer() }])
              .flatten()
          }
          return fImg
        })
        .then((img) =>
          img.toFile(
            `public/devices/${brand}/${device}/thumb.webp`.toLowerCase()
          )
        )
        .catch((err) => console.error(err))
    }

    dev.images = dev.images.map((e) => e.toLowerCase())
  }

  devices.sort((a, b) => {
    let res = a.Brand.localeCompare(b.Brand, `en`, {
      sensitivity: `base`,
      caseFirst: false,
    })
    if (res === 0) {
      res = a.Device.localeCompare(b.Device, `en`, {
        sensitivity: `base`,
        caseFirst: false,
      })
    }
    return res
  })

  const rawJson = JSON.stringify(devices)

  await new Promise((resolve, reject) => {
    fs.writeFile(`public/devices.json`, rawJson, `utf8`, function (err) {
      if (err) {
        reject(err)
        return
      }
      resolve(true)
    })
  }).catch((err) => {
    reporter.panicOnBuild(
      `An error occured while writing JSON Object to File.`,
      err
    )
  })

  await new Promise((resolve, reject) => {
    fs.writeFile(
      `public/devices.jsonp`,
      `getIoSTData(${rawJson})`,
      `utf8`,
      function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve(true)
      }
    )
  }).catch((err) => {
    reporter.panicOnBuild(
      `An error occured while writing JSONP Object to File.`,
      err
    )
  })

  // Per-device detail pages
  for (const dev of devices) {
    createPage({
      path:
        `/devices/` +
        encode(dev.Brand).toLowerCase() +
        `/` +
        encode(dev.Device).toLowerCase(),
      component: deviceDetailTemplate,
      context: { device: dev }, // additional data can be passed via context
    })
  }

  // Change history pages
  const deltas =
    JSON.parse(fs.readFileSync(__dirname + `/src/data/deltas.json`)) ?? []
  for (const delta of deltas) {
    createPage({
      path: `/changes/` + delta.date,
      component: deltaTemplate,
      context: { delta }, // additional data can be passed via context
    })
  }
}
