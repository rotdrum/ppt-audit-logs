const request = require('supertest');
const config = require("../../config");
const authorization = config?.tokenSettings?.apiSecretKey ? `Bearer ${config.tokenSettings.apiSecretKey}` : "";

class home {
  async index(server, service) {
    const response = await request(server)
      .get(`${service}/`)
      .set('Authorization', authorization)
      .set('Accept', 'application/json');
    return (response.statusCode);
  }
}
module.exports = new home();
