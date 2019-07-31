const extract = require('extract-zip'),
  fs = require('fs'),
  fetch = require('node-fetch'),
  Readable = require('stream').Readable,
  yaml = require('js-yaml'),
  zlib = require('zlib')

// Get SDE if it doesn't exist
// TODO: Work out a way to dynamically work out if this is the latest version
const SDE_URL = "https://cdn1.eveonline.com/data/sde/tranquility/sde-20190625-TRANQUILITY.zip"
const cwd = process.cwd()
const sde_dir = `${cwd}/eve_sde`
const output_dir = `${cwd}/public/sde`

function log(message) {
  console.log(`[build-sde] ${message}`)
}

async function processTypeIDs() {
  log('processing type ids')
  const typeIDs_data = fs.readFileSync(`${sde_dir}/sde/fsd/typeIDs.yaml`, 'utf-8')
  const typeIDs = yaml.safeLoad(typeIDs_data)
  let typeIDs_transformed = {}

  // transform the data
  Object.keys(typeIDs).forEach(key => {
    item = typeIDs[key]
    // Commented out because for the current time, fax skills aren't marked as published
    // if (!item.published) return   // Use return rather than continue because we're in a function technically

    typeIDs_transformed[key] = {
      groupID: item.groupID,
      name: item.name.en
    }

    if (item.hasOwnProperty('description') && item.description !== undefined && item.description.en !== undefined) {
      typeIDs_transformed[key].description = item.description.en
    }
  })

  // Output the data
  json_string = JSON.stringify(typeIDs_transformed)
  fs.writeFileSync(`${output_dir}/typeIDs.json`, json_string)
  log('wrote typeIDs.json')

  const s = new Readable()
  s.push(json_string)
  s.push(null)

  const zipper = zlib.createGzip()
  const zippedStream = fs.createWriteStream(`${output_dir}/typeIDs.json.gz`)
  s.pipe(zipper).pipe(zippedStream)
  log('wrote typeIDs.json.gz')
}

async function processGroupIDs() {
  log('processing group ids')
  const groupIDs_data = fs.readFileSync(`${sde_dir}/sde/fsd/groupIDs.yaml`, 'utf-8')
  const groupIDs = yaml.safeLoad(groupIDs_data)
  let groupIDs_transformed = {}

  // transform the data
  Object.keys(groupIDs).forEach(key => {
    item = groupIDs[key]

    if (!item.published) return

    groupIDs_transformed[key] = {
      categoryID: item.categoryID,
      name: item.name.en
    }
  })

  // Output the data
  json_string = JSON.stringify(groupIDs_transformed)
  fs.writeFileSync(`${output_dir}/groupIDs.json`, json_string)
  log('wrote groupIDs.json')

  const s = new Readable()
  s.push(json_string)
  s.push(null)

  const zipper = zlib.createGzip()
  const zippedStream = fs.createWriteStream(`${output_dir}/groupIDs.json.gz`)
  s.pipe(zipper).pipe(zippedStream)
  log('wrote groupIDs.json.gz')
}



(async () => {
  if (!fs.existsSync(sde_dir)) {
    log("Creating SDE Dir")
    fs.mkdirSync(sde_dir)

    // Download SDE
    log("Downloading SDE")
    const sde_archive = fs.createWriteStream(`${sde_dir}/sde.zip`)
    const response = await fetch(SDE_URL)
    await new Promise(resolve => response.body.pipe(sde_archive).on('finish', resolve))

    // unzip
    log("Extracting SDE")
    await new Promise(resolve => {
      extract(`${sde_dir}/sde.zip`, { dir: sde_dir }, err => {
        if (err !== undefined) {
          log("Failed to Extract")
          console.log(err)
        } else {
          log("extracted")
        }
        resolve()
      })
    })
  }
  log("doing more stuff")

  if (!fs.existsSync(output_dir)) {
    fs.mkdirSync(output_dir)
  }

  // At this point, we should have the SDE ready to work with

  // We're going to deal with typeIDs.yaml first because that's our
  // primary source of a lot of data
  log("Processing")
  Promise.all([
    processTypeIDs(),
    processGroupIDs()
  ]).then(() => {
    log("Done!")
  })
})()