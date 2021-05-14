const {markovInstance} = require('./markov')

describe('test making chains and text', function() {

    it('should not have `null` at the end of the text', () => {
    markovInstance.makeChains();
    expect(markovInstance.makeText()).not.toContain(null);
    });

    it('should not produce more words than the maximum specified', () => {
        const randomNumber = Math.floor(Math.random() * (10 - 1) + 1)
        markovInstance.makeChains();
        let text = markovInstance.makeText(randomNumber)
        let wordCount = text.split(' ').length;
        expect(wordCount).toBeLessThanOrEqual(randomNumber);   
    })

    it('should not use words that cannot follow a word (except the first)', () => {
        markovInstance.makeChains();
        let text = markovInstance.makeText(6);
        let splitText = text.split(' ');
        const followWords = [];

        for(const [key, val] of Object.entries(markovInstance.chains)){
            followWords.push(...val);
        }

        const comparison = splitText.splice(0,1).every(v => followWords.includes(v));

        expect(comparison).toEqual(true)
    });

    it('should not use the same word twice in a row', () => {
        markovInstance.makeChains();
        let text = markovInstance.makeText();
        const result = text.split(' ').every((v, indx, arr) => arr[indx-1]!==v)  
        expect(result).toEqual(true)
    });
});
