(function (define) {
    'use strict';

    define(function (require) {

        var rest = require('rest'),
            mime = require('rest/interceptor/mime'),

            PredictionIOClient = function (config) {
                config = config || {};
                if (config.apikey) {
                    this.apikey = config.apikey;
                } else {
                    throw new Error('api key is required');
                }
                this.apiurl = config.apiurl || 'http://localhost:8000';
            };

        PredictionIOClient.prototype.makeRequest = function (path, method, entity) {
            var client = rest.chain(mime);
            return client({
                path: path,
                method: method,
                entity: entity
            });
        };

        PredictionIOClient.prototype.addUser = function (uid, params) {
            params = params || {};
            var entity = {
                pio_appkey: this.apikey,
                pio_uid: uid
            };
            this.checkParams(params, ['pio_latlng', 'pio_inactive'], true);
            if (params.pio_latlng) {
                params.pio_latlng = params.pio_latlng.join(',');
            }
            Object.keys(params).forEach(function (el) {
                entity[el] = params[el];
            });
            return this.makeRequest('/users.json', 'POST', entity);
        };

        PredictionIOClient.prototype.getUser = function (uid) {
            return this.makeRequest('/users/' + uid + '.json', 'GET');
        };

        PredictionIOClient.prototype.deleteUser = function (uid) {
            return this.makeRequest('/users/' + uid + '.json', 'DELETE');
        };

        PredictionIOClient.prototype.checkParams = function (parameters, allowed, allowNonPio) {
            parameters = parameters || {};
            allowed = allowed || [];
            Object.keys(parameters).forEach(function (el) {
                if (allowed.indexOf(el) === -1) {
                    if (el.indexOf('pio_') === 0 || !allowNonPio) {
                        throw new Error(el + ' paramter is not allowed for this request');
                    }
                }
            });
            return true;
        };

        return PredictionIOClient;
    });

}(
    typeof define === 'function' && define.amd ? define : function (factory) {
        module.exports = factory(require);
    }
));