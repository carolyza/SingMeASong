import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("Downvote", () => {
  it("should call delete when updated score is lowest then -5", async () => {
    const data = {
      id: faker.datatype.number(),
    };

    jest.spyOn(recommendationRepository, "find").mockResolvedValue({
      id: data.id,
      score: faker.datatype.number(),
      name: faker.name.findName(),
      youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
    });

    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValue({
      id: data.id,
      score: -6,
      name: faker.name.findName(),
      youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
    });

    const remove = jest
      .spyOn(recommendationRepository, "remove")
      .mockResolvedValue(undefined);

    await recommendationService.downvote(data.id);

    expect(remove).toHaveBeenCalledWith(data.id);
  });

  it("should call decrement with correct values", async () => {
    const data = {
      id: faker.datatype.number(),
    };

    jest.spyOn(recommendationRepository, "find").mockResolvedValue({
      id: data.id,
      score: faker.datatype.number(),
      name: faker.name.findName(),
      youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
    });

    const update = jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValue({
        id: data.id,
        score: faker.datatype.number(),
        name: faker.name.findName(),
        youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
      });

    await recommendationService.downvote(data.id);

    expect(update).toHaveBeenCalledWith(data.id, "decrement");
  });

  it("should call repository given correct params", async () => {
    const data = {
      id: faker.datatype.number(),
    };

    const find = jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValue({
        id: data.id,
        score: faker.datatype.number({ min: -4 }),
        name: faker.name.findName(),
        youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
      });

    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValue({
      id: data.id,
      score: faker.datatype.number(),
      name: faker.name.findName(),
      youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
    });

    await recommendationService.downvote(data.id);

    expect(find).toHaveBeenCalledWith(data.id);
  });
});
