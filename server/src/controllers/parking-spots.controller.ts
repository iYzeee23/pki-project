import { ParkingSpotModel } from "../models";
import { toParkingSpotDto } from "../mappers";
import { asyncHandler, HttpError } from "../utils";
import { NUM_OF_NEAREST_OBJECTS, ParkingSpotDto } from "@app/shared";

export class ParkingSpotsController {
  list = asyncHandler(async (_req, res, _next) => {
    const spots = await ParkingSpotModel.find();

    const dtos: ParkingSpotDto[] = spots.map(toParkingSpotDto);
    res.json(dtos);
  });

  getById = asyncHandler(async (req, res, _next) => {
    const spot = await ParkingSpotModel.findById(req.params.id);
    if (!spot) throw new HttpError(404, "Parking spot not found");
    
    const dto: ParkingSpotDto = toParkingSpotDto(spot);
    res.json(dto);
  });

  nearest = asyncHandler(async (req, res, _next) => {
    if (!req.query.lng) throw new HttpError(400, "Query param lng is required");
    if (!req.query.lat) throw new HttpError(400, "Query param lat is required");

    const lng = Number(req.query.lng);
    const lat = Number(req.query.lat);

    const spots = await ParkingSpotModel
      .find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
          },
        },
      })
      .limit(NUM_OF_NEAREST_OBJECTS);

    const dtos: ParkingSpotDto[] = spots.map(toParkingSpotDto);
    res.json(dtos);
  });

  create = asyncHandler(async (req, res, _next) => {
    const body = req.body as {
      name: string;
      location: { lng: number; lat: number; };
    };

    const doc = {
      name: body.name,
      location: { coordinates: [body.location.lng, body.location.lat] }
    };

    const created = await ParkingSpotModel.create(doc);

    const dto: ParkingSpotDto = toParkingSpotDto(created);
    res.status(201).json(dto);
  });

  update = asyncHandler(async (req, res, _next) => {
    const parkingSpotId = req.params.id;
    const parkingSpot = await ParkingSpotModel.findById(parkingSpotId);
    if (!parkingSpot) throw new HttpError(404, "Parking spot not found");

    const body = req.body as {
      name: string;
      location: { lng: number; lat: number; };
    };

    parkingSpot.name = body.name;
    parkingSpot.location = {
      type: "Point",
      coordinates: [body.location.lng, body.location.lat]
    };

    await parkingSpot.save();

    const dto: ParkingSpotDto = toParkingSpotDto(parkingSpot);
    res.json(dto);
  });

  remove = asyncHandler(async (req, res, _next) => {
    const deleted = await ParkingSpotModel.findByIdAndDelete(req.params.id);
    if (!deleted) throw new HttpError(404, "Parking spot not found");

    res.status(204).json({ ok: true });
  });
}
