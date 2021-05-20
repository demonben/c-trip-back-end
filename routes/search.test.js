require('../lib/config');
const supertest = require('supertest');
const { getSearchResult } = require('../data/search');
const app = require('../server');
const faker = require('faker');

describe('Search route', () => {
  jest.setTimeout(30000);
  describe('/?query', () => {
    const checkInDate = '2021-06-03';
    const checkOutDate = '2021-06-05';

    const query = `place=${faker.address.city()}&checkIn=${checkInDate}&checkOut=${checkOutDate}&adults1=${faker.datatype.number()}`;
    console.log(query);

    // beforeAll(async () => {
    //   // const passwordHash = await hashPassword(user.password);
    //   // const userId = await addUser(user.email, passwordHash);
    //   // user.id = userId;
    //   // token = generateUserToken(user);
    //   const { results } = await getSearchResult(
    //     query.place,
    //     query.checkIn,
    //     query.checkOut,
    //     query.adults1
    //   );
    // });

    it('Should return hotel(s)', async () => {
      const response = await supertest(app).get(`/search?${query}`);
      expect(response.statusCode).toBe(200);
      // expect(response.body).toEqual({
      //   results: {
      //     ...result,
      //   },
      // });
    });
    // it('Should return empty array if not found', async () => {
    //   const response = await supertest(app).get(`/?${query}`);
    //   expect(response.statusCode).toBe(200);
    //   expect(response.body).toEqual({
    //     results: [],
    //   });
    // });
  });

  describe('GET /?', () => {});
});
