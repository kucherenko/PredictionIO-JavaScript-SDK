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

            if (params.pio_latlng) {
                entity.pio_latlng = params.pio_latlng.join(',');
            }

            if (params.hasOwnProperty('pio_inactive')) {
                entity.pio_inactive = params.pio_inactive;
            }
            this.makeRequest('/users.json', 'POST', entity);
        };

        PredictionIOClient.prototype.checkPIOParams = function (parameters, allowed) {
            parameters = parameters || {};
            allowed = allowed || [];
            Object.keys(parameters).forEach(function (el) {
                if (allowed.indexOf(el) === -1) {
                    throw new Error(el + ' paramter is not allowed');
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