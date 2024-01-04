const path = require('path'); //stdlib
//help us build the path from compiled.js to inbox.sol file, cross-platform compatibility guaranteed
const fs = require('fs'); //stdlib
const solc = require('solc'); 
const inboxPath = path.resolve(__dirname, 'contracts', 'inbox.sol');
//__dirname takes us from the root folder to the inbox folder
const source = fs.readFileSync(inboxPath, 'utf8');
//read in the source code from sol file, utf8 encoding used for inbox.sol

module.exports = solc.compile(source, 1).contracts[':Inbox'];

//trying to compile 1 file and exporting the :Inbox object from contracts which contains the bytecode and ABI