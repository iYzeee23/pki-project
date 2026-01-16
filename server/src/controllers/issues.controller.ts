import { IssueModel, BikeModel } from "../models";
import { toIssueDto } from "../mappers";
import { asyncHandler, HttpError } from "../utils";
import { IssueDto } from "@app/shared";

export class IssuesController {
  create = asyncHandler(async (req, res, _next) => {
    const body = req.body as {
      bikeId: string;
      description: string;
    };

    const bike = await BikeModel.findById(body.bikeId);
    if (!bike) throw new HttpError(404, "Bike not found");

    const issue = await IssueModel.create({
      user: req.auth!.userId,
      bike: body.bikeId,
      description: body.description
    });

    const dto: IssueDto = toIssueDto(issue);
    res.status(201).json(dto);
  });

  myList = asyncHandler(async (req, res, _next) => {
    const issues = await IssueModel
      .find({ user: req.auth!.userId })
      .sort({ reportedAt: -1 });

    const dtos: IssueDto[] = issues.map(toIssueDto);
    res.json(dtos);
  });

  listAll = asyncHandler(async (_req, res, _next) => {
    const issues = await IssueModel
      .find()
      .sort({ reportedAt: -1 });
    
    const dtos: IssueDto[] = issues.map(toIssueDto);
    res.json(dtos);
  });

  getById = asyncHandler(async (req, res, _next) => {
    const issue = await IssueModel.findById(req.params.id);
    if (!issue) throw new HttpError(404, "Issue not found");
    
    const dto: IssueDto = toIssueDto(issue);
    res.json(dto);
  });
}
