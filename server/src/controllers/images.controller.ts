import { saveImage } from "../image-utils";
import { ImageModel } from "../models";
import { asyncHandler, HttpError } from "../utils";
import { toImageDto } from "../mappers";
import { ImageDto } from "@app/shared";

export class ImagesController {
  upload = asyncHandler(async (req, res, _next) => {
    const files = (req.files ?? []) as Express.Multer.File[];
    if (!files.length) throw new HttpError(400, "No files uploaded");

    const body = req.body as {
      ownerId: string;
      ownerModel: string;
    };

    const paths = files.map(f => saveImage(f.buffer, f.originalname));
    const created = await ImageModel.insertMany(
      paths.map(p => ({
        ownerId: body.ownerId,
        ownerModel: body.ownerModel,
        path: p
      }))
    );

    const dtos: ImageDto[] = created.map(m => toImageDto(m as any));
    res.status(201).json(dtos);
  });
}
