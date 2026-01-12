import { BikeDto, type RentalDto } from "@app/shared";

import { RentalModel, BikeModel, ParkingSpotModel, ImageModel } from "../models";
import { toBikeDto, toRentalDto } from "../mappers";
import { asyncHandler, HttpError } from "../utils";

export class RentalsController {
  start = asyncHandler(async (req, res, _next) => {
    const body = req.body as { 
      bikeId: string;
    };

    const bike = await BikeModel.findById(body.bikeId)
    if (!bike) throw new HttpError(404, "Bike not found");
    if (bike.status !== "Available") throw new HttpError(400, "Bike is not available");

    bike.status = "Busy";
    await bike.save();

    const bikeDto: BikeDto = toBikeDto(bike);
    const io = req.app.get("io");
    io.emit("bike:updated", bikeDto);

    const doc = {
      user: req.auth!.userId,
      bike: body.bikeId
    };
    const rental = await RentalModel.create(doc);

    const dto: RentalDto = toRentalDto(rental);
    res.status(201).json(dto);
  });

  active = asyncHandler(async (req, res, _next) => {
    const rental = await RentalModel.findOne({ user: req.auth!.userId, endAt: null });
    if (!rental) return res.json(null);

    const dto: RentalDto = toRentalDto(rental);
    res.json(dto);
  });

  finish = asyncHandler(async (req, res, _next) => {
    const body = req.body as { 
      description: string;
    };

    const rental = await RentalModel.findOne({ user: req.auth!.userId, endAt: null });
    if (!rental) throw new HttpError(400, "No active rental");

    const bike = await BikeModel.findById(rental.bike);
    if (!bike) throw new HttpError(404, "Bike not found");
    if (bike.status !== "Busy") throw new HttpError(400, "Bike is not busy");

    const lng = bike.location!.coordinates[0];
    const lat = bike.location!.coordinates[1];
    const parkingSpot = await ParkingSpotModel.findOne({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 50,
        }
      }
    });
    if (!parkingSpot) throw new HttpError(404, "Parking spot not found");

    bike.status = "Available";
    await bike.save();

    const bikeDto: BikeDto = toBikeDto(bike);
    const io = req.app.get("io");
    io.emit("bike:updated", bikeDto);

    rental.endAt = new Date();

    const durationMs = rental.endAt.getTime() - rental.startAt.getTime();
    const hours = Math.ceil(durationMs / (1000 * 60 * 60));
    
    rental.totalCost = hours * bike.pricePerHour;
    rental.description = body.description;

    await rental.save();

    const dto: RentalDto = toRentalDto(rental);
    res.json(dto);
  });

  history = asyncHandler(async (req, res, _next) => {
    const rentals = await RentalModel
      .find({ user: req.auth!.userId })
      .sort({ startAt: -1 });

    const dtos: RentalDto[] = rentals.map(toRentalDto);
    res.json(dtos);
  });

  listAll = asyncHandler(async (_req, res, _next) => {
    const rentals = await RentalModel
      .find()
      .sort({ startAt: -1 });

    const dtos: RentalDto[] = rentals.map(toRentalDto);
    res.json(dtos);
  });

  getById = asyncHandler(async (req, res, _next) => {
    const rental = await RentalModel.findById(req.params.id);
    if (!rental) throw new HttpError(404, "Rental not found");

    const dto: RentalDto = toRentalDto(rental);
    res.json(dto);
  });
}
