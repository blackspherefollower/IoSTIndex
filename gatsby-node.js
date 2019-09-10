const path = require(`path`)
const fs = require(`fs`)

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const modalMarkdownTemplate = path.resolve(
    `src/templates/modalMarkdownTemplate.js`
  )

  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            frontmatter {
              path
            }
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

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: modalMarkdownTemplate,
      context: {}, // additional data can be passed via context
    })
  })

  const result2 = await graphql(`
    query {
      allDevicesCsv(sort: { fields: [Brand, Device] }) {
        edges {
          node {
            Brand
            Device
            Detail
            Availability
            Connection
            Type
            Notes
            Buttplug_C_
            Buttplug_JS
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
            Linear_Actuators
            Estim
            Camera
            Buttons
            Accelerometers
            Vibrators
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
    dev.id = i
    const cs = dev.Buttplug_C_.length > 0 && dev.Buttplug_C_ !== `0`
    const js = dev.Buttplug_JS.length > 0 && dev.Buttplug_JS !== `0`
    dev.Buttplug_CSharp = dev.Buttplug_C_
    delete dev.Buttplug_C_
    dev.ButtplugSupport = 0
    if (cs) dev.ButtplugSupport |= 1
    if (js) dev.ButtplugSupport |= 2

    const bpProps = [
      `ButtplugSupport`,
      `Buttplug_CSharp`,
      `Buttplug_JS`,
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
    bpProps.forEach(prop => {
      dev.Buttplug[prop] = dev[prop]
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

    const outputFeatures = [
      `Suction`,
      `Speaker`,
      `Rotators`,
      `Grips_Expanders`,
      `Heaters`,
      `Lights`,
      `Linear_Actuators`,
      `Estim`,
      `Camera`,
      `Vibrators`,
    ]

    dev.Features = {
      Inputs: {},
      Outputs: {},
      InputsSummary: dev.Inputs,
      OutputsSummary: dev.Outputs,
    }
    delete dev.Inputs
    delete dev.Outputs
    inputFeatures.forEach(prop => {
      dev.Features.Inputs[prop] = dev[prop]
      delete dev[prop]
    })
    outputFeatures.forEach(prop => {
      dev.Features.Outputs[prop] = dev[prop]
      delete dev[prop]
    })

    devices.push(dev)
  })

  const rawJson = JSON.stringify(devices)

  await new Promise((resolve, reject) => {
    fs.writeFile(`public/devices.json`, rawJson, `utf8`, function(err) {
      if (err) {
        reject(err)
        return
      }
      resolve(true)
    })
  }).catch(err => {
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
      function(err) {
        if (err) {
          reject(err)
          return
        }
        resolve(true)
      }
    )
  }).catch(err => {
    reporter.panicOnBuild(
      `An error occured while writing JSONP Object to File.`,
      err
    )
  })
}
