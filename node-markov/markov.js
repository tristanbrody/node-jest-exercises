/** Textual markov chain generator */

const fs = require('fs');

class MarkovMachine {
	/** build markov machine; read in text.*/

	constructor(text) {
		let words = text.split(/[ \r\n]+/);
		this.words = words.filter(c => c !== '');
		this.makeChains();
	}

	/** set markov chains:
	 *
	 *  for text of "the cat in the hat", chains will be
	 *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

	makeChains() {
		this.chains = {};
		for (let i = 0; i < this.words.length; i++) {
			let newArr = this.words.filter(function (word, index, array) {
				return array[index - 1] === array[i];
			});
			if (this.words.length === i + 1) {
				newArr.push(null);
			}
			this.chains[this.words[i]] = newArr;
		}
	}

	*textGenerator() {
		//generate random text one word at a time
		let word = randomProperty(this.chains);
		let str = word;
		while (word !== null) {
			const set = new Set(this.chains[word]);
			const allowedWords = [...set];

			let newWord = allowedWords[randomNumber(0, allowedWords.length)];

			if (newWord !== null) str += ` ${newWord}`;
			word = newWord;
			yield word;
		}
		return str;
	}

	/** return random text from chains */

	makeText(numWords = 100) {
		let word = randomProperty(this.chains);
		let str = word;
		while (word !== null) {
			if (str.split(' ').length === numWords) break;

			const set = new Set(this.chains[word]);
			const allowedWords = [...set];

			let newWord = allowedWords[randomNumber(0, allowedWords.length)];

			if (newWord !== null) str += ` ${newWord}`;
			word = newWord;
		}
		return str;
	}
}

generateTextFromFile('eggs.txt');

function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function randomProperty(obj) {
	const keys = Object.keys(obj);
	return keys[randomNumber(0, keys.length)];
}

function generateTextFromFile(path) {
	fs.readFile(path, 'utf8', function (err, data) {
		if (err) {
			console.log(err);
			return;
		}
		let machine = new MarkovMachine(data);
		machine.makeChains();
	});
}

const machine = new MarkovMachine('the cat in the hat is in the hat');

module.exports = { markovInstance: machine, MarkovMachine };
