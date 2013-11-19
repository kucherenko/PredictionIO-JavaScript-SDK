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

    it("should make client with api url", function () {
        var url = 'example url',
            sut = new PredictionIOClient({
                'apikey': 'key',
                'apiurl': url
            });
        sut.apiurl.should.equal(url);
    });

    it("should make client with default api url", function () {
        var sut = new PredictionIOClient({
                'apikey': 'key'
            });
        sut.apiurl.should.equal('http://localhost:8000');
    });

    describe('User', function () {
        it('should create user by user_id', function () {
            sut.createUser('uid');
        });
    });

});