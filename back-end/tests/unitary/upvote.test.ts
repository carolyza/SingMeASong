import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import { notFoundError } from "../../src/utils/errorUtils.js";

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("Upvote", () => {
  it("should throw a not found error if no recommendation is found", async () => {
    jest.spyOn(recommendationRepository, "find").mockReturnValue(null);

    return expect(recommendationService.upvote(3)).rejects.toEqual(
      notFoundError()
    );
  });

  it("should geta a recommendation by id", async () => {
    const data = {
      id: faker.datatype.number(),
    };

    const find = jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValue({
        id: data.id,
        score: faker.datatype.number(),
        name: faker.name.findName(),
        youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValue(undefined);
    await recommendationService.upvote(data.id);
    expect(find).toHaveBeenCalledWith(data.id);
  });

  it("should call increment with correct values", async () => {
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

    await recommendationService.upvote(data.id);

    expect(update).toHaveBeenCalledWith(data.id, "increment");
  });
});
