const fs = require('fs')
const util = require('util')

const log_file = fs.createWriteStream(__dirname + '/logs/debug.log', { flags: 'w' })
const log_stdout = process.stdout

module.exports = function log(d) {
	let str = util.format(d) + "\n"

	log_file.write(str)
	log_stdout.write(str)
}
