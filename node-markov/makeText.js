/** Command-line tool to generate Markov text. */
(async () => {
const fs = require('fs');
const axios = require('axios');
const doAsync = require('doasync');
const MarkovMachine = require("./markov");


async function getFileData(path) {
	return fs.readFile(path, 'utf8', function (err, data) {
		if (err) {
			console.log(err);
			return;
		}
	});
}

async function getURLData(url) {
	try {
		const res = await axios.get(url);
		return res.data;
	} catch (err) {
		console.log(`Error: Request failed: ${err}`);
	}
}

const pathArg = process.argv[2];
let re = /^(www)|(https)/;

let textData = await getData(process.argv[2])
const machine = new MarkovMachine.MarkovMachine(textData);
machine.makeChains();
console.log(machine.makeText());

async function getData(arg){
    let textData;
    if (pathArg.match(re)) {
        textData = await getURLData(pathArg).then(data => data);
    } else {
        textData = await doAsync(fs)
        .readFile(process.argv[2], 'utf8')
        .then(data => data);
    }
    return textData;
    }
})();
