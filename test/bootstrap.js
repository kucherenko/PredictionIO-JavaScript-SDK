var chai = require('chai'),
    sinon = require('sinon');

chai.should();

global.expect = chai.expect;

beforeEach(function () {
    global.env = sinon.sandbox.create();
});

afterEach(function () {
    global.env.restore();
});

