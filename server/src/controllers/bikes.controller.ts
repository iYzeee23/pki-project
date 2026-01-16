import { BikeModel } from "../models";
import { toBikeDto } from "../mappers";
import { asyncHandler, HttpError } from "../utils";
import { BikeDto, BikeStatus } from "@app/shared";

export class BikesController {
  list = asyncHandler(async (_req, res, _next) => {
    const bikes = await BikeModel.find();

    const dtos: BikeDto[] = bikes.map(b => toBikeDto(b));
    res.json(dtos);
  });

  getById = asyncHandler(async (req, res, _next) => {
    const bikeId = req.params.id;
    const bike = await BikeModel.findById(bikeId);
    if (!bike) throw new HttpError(404, "Bike not found");

    const dto: BikeDto = toBikeDto(bike);
    res.json(dto);
  });

  create = asyncHandler(async (req, res, _next) => {
    const body = req.body as {
      type: string;
      pricePerHour: number;
      status: BikeStatus;
      location: { lng: number; lat: number; };
    };

    const doc = {
      type: body.type,
      pricePerHour: body.pricePerHour,
      status: body.status,
      location: { coordinates: [body.location.lng, body.location.lat] }
    };

    const created = await BikeModel.create(doc);
    const dto: BikeDto = toBikeDto(created);
    res.status(201).json(dto);
  });

  update = asyncHandler(async (req, res, _next) => {
    const bikeId = req.params.id;
    const bike = await BikeModel.findById(bikeId);
    if (!bike) throw new HttpError(404, "Bike not found");

    const body = req.body as {
      type: string;
      pricePerHour: number;
      status: BikeStatus;
      location: { lng: number; lat: number; };
    };

    bike.type = body.type;
    bike.pricePerHour = body.pricePerHour;
    bike.status = body.status;
    bike.location = { 
      type: "Point",
      coordinates: [body.location.lng, body.location.lat] 
    };

    await bike.save();

    const dto: BikeDto = toBikeDto(bike);
    const io = req.app.get("io");
    io.emit("bike:updated", dto);

    res.json(dto);
  });

  updateLocation = asyncHandler(async (req, res, _next) => {
    const body = req.body as { 
      location: { lng: number; lat: number; };
    };

    const updated = await BikeModel.findByIdAndUpdate(
      req.params.id,
      { 
        location: { 
          type: "Point",
          coordinates: [body.location.lng, body.location.lat] 
        }
      },
      { new: true, runValidators: true }
    );

    if (!updated) throw new HttpError(404, "Bike not found");

    const dto: BikeDto = toBikeDto(updated);
    const io = req.app.get("io");
    io.emit("bike:updated", dto);

    res.json(dto);
  });

  changeStatus = asyncHandler(async (req, res, _next) => {
    const body = req.body as { 
      status: string 
    };

    const updated = await BikeModel.findByIdAndUpdate(
      req.params.id,
      { status: body.status },
      { new: true, runValidators: true }
    );

    if (!updated) throw new HttpError(404, "Bike not found");

    const dto: BikeDto = toBikeDto(updated);
    const io = req.app.get("io");
    io.emit("bike:updated", dto);

    res.json(dto);
  });

  remove = asyncHandler(async (req, res, _next) => {
    const deleted = await BikeModel.findByIdAndDelete(req.params.id);
    if (!deleted) throw new HttpError(404, "Bike not found");
    
    res.status(204).json({ ok: true });
  });
}
