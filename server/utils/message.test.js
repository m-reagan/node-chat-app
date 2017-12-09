const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

describe('Testing generateMessage function', () => {
  it('Should create new message as expected', () => {
      var from = 'Admin';
      var text = 'hello';

      var message = generateMessage(from,text);

      expect(message.createdAt).toBeA('number');
      expect(message.from).toBe(from);
      expect(message.text).toBe(text);
  });

  it('Testing create location message', () => {
      var from = 'Admin';
      var latitude = 1;
      var longitude = 2;
      var locMessage = generateLocationMessage(from,latitude,longitude);

      expect(locMessage.from).toBe(from)
      expect(locMessage.url).toBe('https://www.google.com/maps?q=1,2');
      expect(locMessage.createdAt).toBeA('number');
  });

});
