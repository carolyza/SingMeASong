import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { jest } from "@jest/globals";
import { notFoundError } from "../../src/utils/errorUtils.js";

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("Get random", () => {
  it("should throw a not found error when getByFilter don't find any recommendations with random lower than 0.7", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

    expect(recommendationService.getRandom()).rejects.toEqual(notFoundError());
  });

  it("should throw a not found error when getByFilter don't find any recommendations with random higher than 0.7", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.8);

    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

    expect(recommendationService.getRandom()).rejects.toEqual(notFoundError());
  });
});
