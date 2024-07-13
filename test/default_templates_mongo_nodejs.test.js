const path = require('path');
require("dotenv").config({ path: `${__dirname}/../../.env` });
const config = require("../config");
const template = require('../test/controllers/index');
const server = require('../server');
const service = `/${config.name}`


describe('GET default_templates_mongo_nodejs/', () => {
    test('case : success', async () => {
        let res = await template.HomeController.index(server, service)
        expect(res).toBe(200);
    })
});
