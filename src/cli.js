const { engines: { node: version } } = require('../package.json')
const semver = require('semver')
const usingVersion = process.version
const Invitation = require('./invitation')

if (!semver.satisfies(usingVersion, version)) {
  console.error(`Current "node" version is "${usingVersion}", expected is "${version}".`)
  process.exit(0)
}

(async function () {
  try {
    const invitation = await new Invitation().readList()
    invitation.chooseWithinKM(100).sortById().printInvited()
  } catch (e) {
    console.error(e.message)
    process.exit(0)
  }
})()
