const expect = require('expect');
const generateMessage = require('./message');

describe('generateMessage', () => {
  it('should gen from, text and time', () => {
      var from = 'lzzzzzzzz';
      var text = 'ccccccc';
      var message = generateMessage(from, text);
      expect(message.createAt).tobeA('Number');
      expect(message).toInclude({from, text});
  });
});
