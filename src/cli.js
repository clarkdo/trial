const { engines: { node: version } } = require('../package.json')
const semver = require('semver')
const usingVersion = process.version
const Invitation = require('./invitation')

if (!semver.satisfies(usingVersion, version)) {
  console.error(`Current "node" version is "${usingVersion}", expected is "${version}".`)
  process.exit(0)
}

(async function calculate () {
  const invitation = new Invitation();
  (await invitation.invite100KM()).printInvited()
})()
