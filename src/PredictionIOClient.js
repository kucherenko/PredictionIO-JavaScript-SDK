var PredictionIOClient = function (config) {
    config = config || {};
    if (config.apikey) {
        this.apikey = config.apikey;
    } else {
        throw new Error('api key is required');
    }
}

module.exports = PredictionIOClient;