var rest = require('rest'),
    when = require('when'),
    PredictionIOClient = require('../src/PredictionIOClient');

describe('PredictionIOClient', function () {

    it("should make client with required api key", function () {
        var key = 'example key',
            sut = new PredictionIOClient({'apikey': key});
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

    describe('Request', function () {
        var sut;
        beforeEach(function () {
            sut = new PredictionIOClient({ 'apikey': 'key' });
        });
        it('should make promise for request to server', function () {
            var promise = env.stub().returns('promise');
            env.stub(rest, 'chain').returns(promise);
            sut.makeRequest().should.equal('promise')
        });

        it('should make request to server with passed params', function () {
            var promise = env.stub(),
                entity = {some: 'field'};
            env.stub(rest, 'chain').returns(promise);
            sut.makeRequest('path', 'POST', entity);

            promise.should.have.been.calledWith({
                path: 'path',
                method: 'POST',
                entity: entity
            });
        });

        it('should check parameters for pio_ parameters', function () {
            var parameters = {
                    pio_zz: '11'
                },
                allowed = [
                    'pio_zz'
                ];
            sut.checkPIOParams(parameters, allowed).should.equal(true);
        });

        it('should throw exception if parameter not allowed', function () {
            var parameters = {
                    pio_zzz: '11'
                },
                allowed = [
                    'pio_zz'
                ];
            (function () {
                sut.checkPIOParams(parameters, allowed);
            }).should.throw(/pio_zzz paramter is not allowed/);
        });

    });


    describe('User API', function () {
        var sut, apikey;
        beforeEach(function () {
            apikey = "apikey"
            sut = new PredictionIOClient({ 'apikey': apikey })
        });
        describe('(Add User)', function () {

            it("should add user by uid", function () {
                var makeRequest = env.stub(sut, 'makeRequest');
                sut.addUser('uid');
                makeRequest.should.have.been.calledWith(
                    '/users.json',
                    'POST',
                    {
                        pio_appkey: apikey,
                        pio_uid: 'uid'
                    }
                );
            });

            it('should add user with geo info', function () {
                var makeRequest = env.stub(sut, 'makeRequest');
                sut.addUser('uid', {pio_latlng: [12.34, 5.67]});
                makeRequest.should.have.been.calledWith(
                    '/users.json',
                    'POST',
                    {
                        pio_appkey: apikey,
                        pio_uid: 'uid',
                        pio_latlng: '12.34,5.67'
                    }
                );
            });

            it('should add user with inactive status', function () {
                var makeRequest = env.stub(sut, 'makeRequest');
                sut.addUser('uid', {pio_inactive: true});
                makeRequest.should.have.been.calledWith(
                    '/users.json',
                    'POST',
                    {
                        pio_appkey: apikey,
                        pio_uid: 'uid',
                        pio_inactive: true
                    }
                );
            });


        });
    });

});