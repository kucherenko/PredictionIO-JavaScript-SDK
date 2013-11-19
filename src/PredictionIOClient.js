(function (define) {
    'use strict';

    define(function (require) {

        var PredictionIOClient = function (config) {
            config = config || {};
            if (config.apikey) {
                this.apikey = config.apikey;
            } else {
                throw new Error('api key is required');
            }
            this.apiurl = config.apiurl || 'http://localhost:8000';
        }

        return PredictionIOClient;
    });

}(
    typeof define === 'function' && define.amd ? define : function (factory) {
        module.exports = factory(require);
    }
));