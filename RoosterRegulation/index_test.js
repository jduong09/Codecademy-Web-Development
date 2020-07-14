//import the assert module
const assert = require('assert');
const Rooster = require('../index');

describe('Rooster', () => {
  describe('.announceDawn', () => {
    it('returns a rooster call', () => {
      //define expected output (setup)
      const expected = 'cock-a-doodle-doo!';

      //call the function under test (exercise)
      const result = Rooster.announceDawn();

      //use an assert function (verify)
      assert.equal(result, expected);
    });
  });
  describe('.timeAtDawn', () => {
    it('returns its argument as a string', () => {
      //define expected output (setup)
      const expected = '7';

      //call the function under test (exercise)
      const result = Rooster.timeAtDawn(7);

      //use an assert function (verify)
      assert.strictEqual(result, expected);
    });
  });
  describe('.timeAtDawn', () => {
    it ('throws an argument if passed a number less than 0', () => {
      //define expected output (setup)
      const expected = RangeError;
      const result = -1;
      //use an assert function (verify)
      assert.throws(() => {
        Rooster.timeAtDawn(result);
      }, RangeError);
    });
    it ('throws an error if passed a number greater than 23', () => {
      //define expected output (setup)
      const expected = RangeError;
      const result = 24;
      //use an assert function (verify)
      assert.throws(() => {
        Rooster.timeAtDawn(result);
      }, RangeError);
    });
  });
});
