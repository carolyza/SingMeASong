import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import _ from "lodash";
import { conflictError, notFoundError } from "../../src/utils/errorUtils.js";

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("Get", () => {
  it("should get all recommendations given correct params", async () => {
    const find = jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValue([
        {
          id: faker.datatype.number(),
          score: faker.datatype.number(),
          name: faker.name.findName(),
          youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
        },
      ]);

    await recommendationService.get();

    expect(find).toHaveBeenCalled();
  });
});

describe("Get by id", () => {
  it("should return a recommendation given a valid id", async () => {
    const data = {
      name: faker.name.findName(),
      youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
    };

    const find = jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValue({ id: 1, score: 0, ...data });

    const result = await recommendationService.getById(1);

    expect(result).toEqual({ id: 1, score: 0, ...data });
  });

  it("should throw notFoundError given a valid id", async () => {
    const data = {
      name: faker.name.findName(),
      youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
    };

    jest.spyOn(recommendationRepository, "find").mockResolvedValue(null);

    expect(async () => {
      await recommendationService.getById(1);
    }).rejects.toEqual(notFoundError());
  });
});

describe("GetTop", () => {
  it("should get amount by score given correct params", async () => {
    const data = {
      amount: faker.datatype.number(),
    };

    const amount = jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockResolvedValue(
        _.times(10, () => ({
          id: faker.datatype.number(),
          score: faker.datatype.number(),
          name: faker.name.findName(),
          youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
        }))
      );

    await recommendationService.getTop(data.amount);

    expect(amount).toHaveBeenCalledWith(data.amount);
  });
});
