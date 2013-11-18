var PredictionIOClient = require('../src/PredictionIOClient');

describe('PredictionIOClient', function () {

    it("should make client with required api key", function () {
        var key = 'example key',
            sut = new PredictionIOClient({'apikey':key});
        sut.apikey.should.equal(key);
    });

    it("should throw exception if apikey is not passed to library", function () {
        var sut = PredictionIOClient;
        sut.should.to.throw(/api key is required/);
    });

});