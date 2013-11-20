(function (define) {
    'use strict';

    define(function (require) {

        function extendObject(object, extend) {
            Object.keys(extend).forEach(function (el) {
                object[el] = extend[el];
            });
        }

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

        PredictionIOClient.prototype.doAction = function (uid, iid, action, params) {
            var actions = ["rate", "like", "dislike", "view", "conversion"],
                entity;
            params = params || {};

            entity = {
                pio_appkey: this.apikey,
                pio_uid: uid,
                pio_iid: iid,
                pio_action: action
            };

            if (actions.indexOf(action) === -1) {
                throw new Error(action +
                    ' action is not supported, you can use only "rate", "like",' +
                    ' "dislike", "view" or "conversion" actions');
            }

            this.checkParams(params, [
                'pio_latlng',
                'pio_t'
            ], true);

            if (params.pio_latlng) {
                params.pio_latlng = params.pio_latlng.join(',');
            }
            extendObject(entity, params);
            this.makeRequest('/actions/u2i.json', 'POST', entity);
        };

        PredictionIOClient.prototype.addItem = function (iid, types, params) {
            params = params || {};
            var entity = {
                pio_appkey: this.apikey,
                pio_iid: iid,
                pio_itypes: types.join(',')
            };
            this.checkParams(params, [
                'pio_latlng',
                'pio_inactive',
                'pio_startT',
                'pio_endT',
                'pio_price',
                'pio_profit'
            ], true);
            if (params.pio_latlng) {
                params.pio_latlng = params.pio_latlng.join(',');
            }
            extendObject(entity, params);
            this.makeRequest('/items.json', 'POST', entity);
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
            extendObject(entity, params);
            return this.makeRequest('/users.json', 'POST', entity);
        };

        PredictionIOClient.prototype.getUser = function (uid) {
            return this.makeRequest('/users/' + uid + '.json', 'GET');
        };

        PredictionIOClient.prototype.getItem = function (iid) {
            return this.makeRequest('/items/' + iid + '.json', 'GET');
        };

        PredictionIOClient.prototype.deleteItem = function (iid) {
            return this.makeRequest('/items/' + iid + '.json', 'DELETE');
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