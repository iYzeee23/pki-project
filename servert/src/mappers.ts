import type { UserDto, BikeDto, ParkingSpotDto, RentalDto, IssueDto, ImageDto } from "@app/shared";
import type { BikeStatus, ImageSource } from "@app/shared";
import type { User, Bike, ParkingSpot, Rental, Issue, Image } from "./models";
import type { HydratedDocument } from "mongoose";

export function toUserDto(u: HydratedDocument<User>): UserDto {
    return {
        id: u._id.toString(),
        username: u.username,
        isAdmin: u.isAdmin,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        email: u.email,
        profileImagePath: u.profileImagePath
    }
}

export function toBikeDto(b: HydratedDocument<Bike>): BikeDto {
    const id = b._id.toString();
    return {
        id: id,
        type: b.type,
        pricePerHour: b.pricePerHour,
        status: b.status as BikeStatus,
        location: {
            lng: b.location.coordinates[0] ?? 0,
            lat: b.location.coordinates[1] ?? 0
        },
        qrCode: `bike:${id}`
    }
}

export function toParkingSpotDto(p: HydratedDocument<ParkingSpot>): ParkingSpotDto {
    return { 
        id: p._id.toString(),
        name: p.name,
        location: { 
            lng: p.location.coordinates[0] ?? 0,
            lat: p.location.coordinates[1] ?? 0
        } 
    };
}

export function toRentalDto(r: HydratedDocument<Rental>): RentalDto {
    return {
        id: r._id.toString(),
        userId: r.user.toString(),
        bikeId: r.bike.toString(),
        startAt: r.startAt.toISOString(),
        endAt: r.endAt ? r.endAt.toISOString() : null,
        totalCost: r.totalCost ?? null,
        description: r.description
    };
}

export function toIssueDto(i: HydratedDocument<Issue>): IssueDto {
    return {
        id: i._id.toString(),
        userId: i.user.toString(),
        bikeId: i.bike.toString(),
        reportedAt: i.reportedAt.toISOString(),
        description: i.description
    };
}

export function toImageDto(i: HydratedDocument<Image>): ImageDto {
    return {
        id: i._id.toString(),
        ownerId: i.ownerId.toString(),
        ownerModel: i.ownerModel as ImageSource,
        takenAt: i.takenAt.toISOString(),
        path: i.path
    };
}
