const request = require("supertest");
const server = require("./../api/server");

describe('Server', () => {
    it('getJokes works', () => {
        return request(server)
            .get('/api/jokes')
            .expect(401)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).toEqual({ message: 'Please provide token in Authorization header' });
            });
    });
});