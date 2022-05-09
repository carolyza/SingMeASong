import { faker } from "@faker-js/faker";
import _ from "lodash";
import supertest from "supertest";
import { prisma } from "../../src/database.js";
import app from "../../src/app.js";
import { create, load } from "../factories/recommendationFactory.js";

beforeEach(truncateAll);

async function truncateAll() {
  await prisma.$executeRaw`
        TRUNCATE TABLE 
          recommendations
    `;
}

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /recommendation", () => {
  it("should return success", async () => {
    const body = {
      name: faker.name.findName(),
      youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
    };

    const result = await supertest(app).post("/recommendations").send(body);

    expect(result.status).toEqual(201);
  });
});

describe("POST /recommendation/:id/upvote", () => {
  it("should return success when exist a recommendation", async () => {
    const data = await create();
    const result = await supertest(app)
      .post(`/recommendations/${data.id}/upvote`)
      .send();

    expect(result.status).toEqual(200);
  });

  it("should return 404 when doesn't exists", async () => {
    const id = faker.datatype.number({ max: 0 });
    const result = await supertest(app)
      .post(`/recommendations/${id}/upvote`)
      .send();

    expect(result.status).toEqual(404);
  });

  it("should return +1 when is possible", async () => {
    const data = await create();

    await supertest(app).post(`/recommendations/${data.id}/upvote`).send();
    const result = await load(data.id);

    expect(result.score - data.score).toEqual(1);
  });
});

describe("POST /recommendation/:id/downvote", () => {
  it("should return success when exist a recommendatrion", async () => {
    const data = await create();

    const result = await supertest(app)
      .post(`/recommendations/${data.id}/downvote`)
      .send();

    expect(result.status).toEqual(200);
  });

  it("should return 404 when doesn't exists", async () => {
    const id = faker.datatype.number({ max: 0 });

    const result = await supertest(app)
      .post(`/recommendations/${id}/downvote`)
      .send();

    expect(result.status).toEqual(404);
  });

  it("should return remove 1 upvote", async () => {
    const data = await create();

    await supertest(app).post(`/recommendations/${data.id}/downvote`).send();

    const result = await load(data.id);
    expect(result.score - data.score).toEqual(-1);
  });

  it("should delete the recommendation when the score is lower than -5", async () => {
    const data = await create({
      score: -5,
    });

    await supertest(app).post(`/recommendations/${data.id}/downvote`).send();

    const result = await load(data.id);
    expect(result).toBeNull();
  });
});

describe("GET /recommendations", () => {
  it("returns 200 and an object with recommendations", async () => {
    const data = await create();

    const { status, body } = await supertest(app).get(`/recommendations`);

    expect(status).toEqual(200);
    expect(body.length > 0).toBe(true);
  });
});

describe("GET /recommendations/random", () => {
  it("returns 200 and an object with random recommendations", async () => {
    const data = await create();

    const { status, body } = await supertest(app).get(
      `/recommendations/random`
    );

    expect(status).toEqual(200);
    expect(typeof body).toBe("object");
  });
});

describe("GET /recommendations/top/:amount", () => {
  it("returns 200 given the amount of top recommendations", async () => {
    const qntd = 3;

    const data = await Promise.all(
      _.times(15, async () => {
        return await create({
          score: faker.datatype.number({ min: qntd }),
        });
      })
    );

    const array = _.take(_.orderBy(data, ["score"], ["desc"]), 3);

    const { status, body } = await supertest(app).get(
      `/recommendations/top/${qntd}`
    );

    expect(status).toEqual(200);
    expect(body).toEqual(array);
  });
});

describe("GET /recommendations/:id", () => {
  it("returns 200 given a valid id", async () => {
    const data = await create();

    const { status, body } = await supertest(app).get(
      `/recommendations/${data.id}`
    );

    expect(status).toEqual(200);
    expect(typeof body).toBe("object");
  });

  it("returns 200 given an invalid id", async () => {
    const id = 99999999;

    const { status, body } = await supertest(app).get(`/recommendations/${id}`);

    expect(status).toEqual(404);
    expect(body).toEqual({});
  });
});
