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
            sut.makeRequest().should.equal('promise');
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
            sut.checkParams(parameters, allowed).should.equal(true);
        });

        it('should throw exception if parameter not allowed', function () {
            var parameters = {
                    pio_zzz: '11'
                },
                allowed = [
                    'pio_zz'
                ];
            (function () {
                sut.checkParams(parameters, allowed);
            }).should.throw(/pio_zzz paramter is not allowed for this request/);
        });

        it('should check parameters for non pio fields in parameters', function () {
            var allowNonPio = true,
                parameters = {
                    test: 'zz'
                };
            sut.checkParams(parameters, [], allowNonPio);
        });

        it('should throw exception for non pio fields in parameters', function () {
            var allowNonPio = false,
                parameters = {
                    test: 'zz'
                };
            (function () {
                sut.checkParams(parameters, [], allowNonPio);
            }).should.throw(/test paramter is not allowed for this request/);
        });

    });

    describe('User-to-Item API', function () {

        var sut, apikey;
        beforeEach(function () {
            apikey = "apikey";
            sut = new PredictionIOClient({ 'apikey': apikey });
        });

        it('should make action from user with item', function () {
            var makeRequest = env.stub(sut, 'makeRequest');
            sut.doAction('uid', 'iid', 'like');
            makeRequest.should.have.been.calledWith(
                '/actions/u2i.json',
                'POST',
                {
                    pio_appkey: apikey,
                    pio_uid: 'uid',
                    pio_iid: 'iid',
                    pio_action: 'like'
                }
            );
        });

        it('should make action from user with item with geoinfo', function () {
            var makeRequest = env.stub(sut, 'makeRequest');
            sut.doAction('uid', 'iid', 'like', {pio_latlng: [12.34, 5.67]});
            makeRequest.should.have.been.calledWith(
                '/actions/u2i.json',
                'POST',
                {
                    pio_appkey: apikey,
                    pio_uid: 'uid',
                    pio_iid: 'iid',
                    pio_action: 'like',
                    pio_latlng: '12.34,5.67'
                }
            );
        });

        it('should throw exception if action is not "rate", "like", "dislike", "view" or "conversion"', function () {
            var makeRequest = env.stub(sut, 'makeRequest');
            (function () {
                sut.doAction('uid', 'iid', 'unlike');
            }).should
                .throw(
                    /unlike action is not supported, you can use only "rate", "like", "dislike", "view" or "conversion" actions/
                );
        });

        it('should check parameters for allowed', function () {
            var params = {},
                checkParameters = env.stub(sut, 'checkParams');
            sut.doAction('uid', 'iid', 'like', params);
            checkParameters.should.have.been.calledWith(params, [
                'pio_latlng',
                'pio_t'
            ], true);
        });
    });

    describe('Item recommendation API', function () {
        var sut, apikey;
        beforeEach(function () {
            apikey = "apikey";
            sut = new PredictionIOClient({ 'apikey': apikey });
        });

        it('should get recommended items', function () {
            
        });
    });

    describe('Item API', function () {
        var sut, apikey;
        beforeEach(function () {
            apikey = "apikey";
            sut = new PredictionIOClient({ 'apikey': apikey });
        });

        it('should get item from server', function () {
            var makeRequest = env.stub(sut, 'makeRequest');
            sut.getItem('iid');
            makeRequest.should.have.been.calledWith('/items/iid.json', 'GET');
        });

        it('should delete item', function () {
            var makeRequest = env.stub(sut, 'makeRequest');
            sut.deleteItem('iid');
            makeRequest.should.have.been.calledWith('/items/iid.json', 'DELETE');
        });


        describe('(Add Item)', function () {

            it("should add item by iid and types", function () {
                var makeRequest = env.stub(sut, 'makeRequest');
                sut.addItem('iid', ['type1', 'type2']);
                makeRequest.should.have.been.calledWith(
                    '/items.json',
                    'POST',
                    {
                        pio_appkey: apikey,
                        pio_iid: 'iid',
                        pio_itypes: 'type1,type2'
                    }
                );
            });

            it('should add user with geo info', function () {
                var makeRequest = env.stub(sut, 'makeRequest');
                sut.addItem('iid', ['type'], {pio_latlng: [12.34, 5.67]});
                makeRequest.should.have.been.calledWith(
                    '/items.json',
                    'POST',
                    {
                        pio_appkey: apikey,
                        pio_iid: 'iid',
                        pio_itypes: 'type',
                        pio_latlng: '12.34,5.67'
                    }
                );
            });

            it('should check parameters for allowed', function () {
                var params = {},
                    checkParameters = env.stub(sut, 'checkParams');
                sut.addItem('aaa', [], params);
                checkParameters.should.have.been.calledWith(params, [
                    'pio_latlng',
                    'pio_inactive',
                    'pio_startT',
                    'pio_endT',
                    'pio_price',
                    'pio_profit'
                ], true);
            });
        });

    });

    describe('User API', function () {
        var sut, apikey;
        beforeEach(function () {
            apikey = "apikey";
            sut = new PredictionIOClient({ 'apikey': apikey });
        });


        it('should get user from server', function () {
            var makeRequest = env.stub(sut, 'makeRequest');
            sut.getUser('uid');
            makeRequest.should.have.been.calledWith('/users/uid.json', 'GET');
        });

        it('should delete user', function () {
            var makeRequest = env.stub(sut, 'makeRequest');
            sut.deleteUser('uid');
            makeRequest.should.have.been.calledWith('/users/uid.json', 'DELETE');
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

            it('should check parameters for allowed', function () {
                var params = {},
                    checkParameters = env.stub(sut, 'checkParams');
                sut.addUser('aaa', params);
                checkParameters.should.have.been.calledWith(params, ['pio_latlng', 'pio_inactive'], true);
            });
        });
    });

});