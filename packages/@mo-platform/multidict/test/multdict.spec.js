import chai from 'chai';
import MultiDictClient from '../src/client';

chai.expect();

const expect = chai.expect;
let dict;

describe('Given an instance of MultiDict', function () {
  before(function () {
    dict = new MultiDictClient();
  });
  describe('phrases search', function () {
    it('should return data', () => {
      dict.search('dyr', 'nb_NO')
      .then(data => {
        data.data.phrases.length.to.be.equa(3)
      })
    });
  });
});
