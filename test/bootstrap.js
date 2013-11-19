var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");

chai.should();
chai.use(sinonChai);

global.expect = chai.expect;

beforeEach(function () {
    global.env = sinon.sandbox.create();
});

afterEach(function () {
    global.env.restore();
});

