import { Request, Response } from "express";
import { recommendationService } from "../services/recommendationsService.js";
import * as testService from "../services/testService.js";

export async function resetDatabase(req: Request, res: Response) {
  await testService.resetDatabase();
  res.sendStatus(200);
}

export async function seedDatabase(req: Request, res: Response) {
  await recommendationService.seed();
  res.sendStatus(201);
}
