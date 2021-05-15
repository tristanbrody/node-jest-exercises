/** Command-line tool to generate Markov text. */
(async () => {
	const prompt = require('prompt-sync')({ sigint: true });

	const fs = require('fs');
	const axios = require('axios');
	const doAsync = require('doasync');
	const striptags = require('striptags');

	const MarkovMachine = require('./markov');

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
			return striptags(res.data.trim());
		} catch (err) {
			console.log(`Error: Request failed: ${err}`);
		}
	}

	const pathArg = process.argv[2];
	let re = /^(www)|(https)/;

	let textData = await getData(process.argv[2]);
	const machine = new MarkovMachine.MarkovMachine(textData);
	machine.makeChains();
	console.log('****************');
	console.log('Press enter to keep generating words. Enter q, ctrl + c or n to quit the script');
	console.log('****************');
	for (let val of machine.textGenerator()) {
		let userPrompt = prompt('');
		console.log(val);
		if (['q', 'n'].includes(userPrompt)) {
			break;
		} else {
			continue;
		}
	}
	async function getData(arg) {
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
