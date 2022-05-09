import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { conflictError } from "../../src/utils/errorUtils.js";
import { create } from "../factories/recommendationFactory.js";

describe("Create recommendation", () => {
  it("should call the create function given a valid body", async () => {
    const data = {
      name: faker.name.findName(),
      youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValue(undefined);

    const insertSong = jest
      .spyOn(recommendationRepository, "create")
      .mockImplementation(async () => {});

    await recommendationService.insert(data);

    expect(insertSong).toHaveBeenCalledWith({
      name: data.name,
      youtubeLink: data.youtubeLink,
    });
    expect(insertSong).toBeCalledTimes(1);
  });

  it("should throw an 409 error given duplicate name", async () => {
    const data = {
      name: faker.name.findName(),
      youtubeLink: `https://www.youtube.com/${faker.datatype.uuid()}`,
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValue({ id: 1, score: 0, ...data });

    const insertSong = jest
      .spyOn(recommendationRepository, "create")
      .mockImplementation(async () => {});

    expect(async () => {
      await recommendationService.insert(data);
    }).rejects.toEqual(conflictError("Recommendations names must be unique"));
  });
});
