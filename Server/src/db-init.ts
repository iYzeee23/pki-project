/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDb } from "./database";
import { hashPassword } from "./utils";
import { UserModel } from "./models/user";
import { BikeModel } from "./models/bike";
import { ParkingSpotModel } from "./models/parking-spot";
import { RentalModel } from "./models/rental";
import { IssueModel } from "./models/issue";
import { ImageModel } from "./models/image";
import { DEFAULT_IMAGE } from "./image-utils";

dotenv.config();

type SeedUser = {
    username: string;
    password: string;
    isAdmin: boolean;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
};

type SeedParkingSpot = {
    name: string;
    lat: number;
    lng: number;
};

const SEED_DIR = path.resolve(__dirname, "..", "seed");

const BIKE_TYPES = [
    "City",
    "Mountain",
    "Road",
    "BMX",
    "E-bike",
    "Folding",
    "Cargo",
    "Hybrid",
    "Gravel",
    "Kids"
] as const;

function loadJson<T>(filename: string): T {
    const fullPath = path.join(SEED_DIR, filename);
    const raw = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(raw) as T;
}

function billedHours(start: Date, end: Date) {
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (60 * 60 * 1000));
}

async function main() {
    // connection
    await connectDb();

    // cleanup
    console.log("Dropping database...");
    await mongoose.connection.db!.dropDatabase();

    // parking spots
    const parkingSeeds = loadJson<SeedParkingSpot[]>("parking-spots.json");
    const parkingDocs = parkingSeeds.map(p => ({
        name: p.name,
        location: { type: "Point", coordinates: [p.lng, p.lat] }
    }));

    const parkingInserted = await ParkingSpotModel.insertMany(parkingDocs);
    console.log(`Inserted parking spots: ${parkingInserted.length}`);

    // users
    const userSeeds = loadJson<SeedUser[]>("users.json");
    const userDocsAsync = userSeeds.map(async u => ({
        username: u.username,
        passwordHash: await hashPassword(u.password),
        isAdmin: u.isAdmin,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        email: u.email,
        profileImagePath: DEFAULT_IMAGE
    }));

    const userDocs = await Promise.all(userDocsAsync);
    const userInserted = await UserModel.insertMany(userDocs);
    const admins = userInserted.filter(u => !!u.isAdmin);
    const regularUsers = userInserted.filter(u => !u.isAdmin);
    console.log(`Inserted admins: ${admins.length}`);
    console.log(`Inserted regular users: ${regularUsers.length}`);

    // bikes
    const prices = [90, 120, 150, 180] as const;
    const statuses = ["Available", "Available", "Available", "Maintenance", "Off"] as const;

    const bikesToCreate = [];
    let typeIdx = 0;

    for (const spot of parkingDocs) {
        const lng = spot.location.coordinates[0];
        const lat = spot.location.coordinates[1];

        for (let i = 0; i < 3; i++) {
            const type = BIKE_TYPES[typeIdx % BIKE_TYPES.length];
            const pricePerHour = prices[(typeIdx + i) % prices.length];
            const status = statuses[(typeIdx + i) % statuses.length];
            typeIdx++;

            bikesToCreate.push({
                type: type,
                pricePerHour: pricePerHour,
                status: status,
                location: { type: "Point", coordinates: [lng, lat] }
            });
        }
    }

    const outsideParkingSpots = [
        { lat: 44.8178, lng: 20.4571 },
        { lat: 44.8132, lng: 20.4619 },
        { lat: 44.7989, lng: 20.4692 },
        { lat: 44.8126, lng: 20.4149 }
    ];

    for (let i = 0; i < outsideParkingSpots.length; i++) {
        const lng = outsideParkingSpots[i]!.lng;
        const lat = outsideParkingSpots[i]!.lat;
        const type = BIKE_TYPES[typeIdx % BIKE_TYPES.length];
        const pricePerHour = prices[typeIdx % prices.length];
        const status = statuses[(typeIdx + i) % statuses.length];
        typeIdx++;

        bikesToCreate.push({
            type: type,
            pricePerHour: pricePerHour,
            status: status,
            location: { type: "Point", coordinates: [lng, lat] } 
        });
    }

    const bikeInserted = await BikeModel.insertMany(bikesToCreate);
    console.log(`Inserted bikes: ${bikeInserted.length}`);

    // rentals
    const availableBikes = bikeInserted.filter(b => b.status === "Available");
    const now = new Date();

    const rentalsToCreate = [
        { user: regularUsers[0]!._id, bike: availableBikes[0]!._id, startMinAgo: 60 * 24 * 9, durationMin: 35,  description: "Kratka voznja do posla" },
        { user: regularUsers[0]!._id, bike: availableBikes[1]!._id, startMinAgo: 60 * 24 * 7, durationMin: 95,  description: "Voznja po centru" },
        { user: regularUsers[0]!._id, bike: availableBikes[2]!._id, startMinAgo: 60 * 24 * 5, durationMin: 140, description: "Obilazak parkova" },
        { user: regularUsers[1]!._id, bike: availableBikes[0]!._id, startMinAgo: 60 * 24 * 3, durationMin: 20,  description: "Brza voznja" },
        { user: regularUsers[1]!._id, bike: availableBikes[1]!._id, startMinAgo: 60 * 24 * 1, durationMin: 75,  description: "Rekreativna voznja" }
    ];

    const rentalDocs = rentalsToCreate.map(r => {
        const startAt = new Date(now.getTime() - r.startMinAgo * 60 * 1000);
        const endAt = new Date(startAt.getTime() + r.durationMin * 60 * 1000);
        const bike = bikeInserted.find(b => b._id.equals(r.bike));
        const totalCost = billedHours(startAt, endAt) * bike!.pricePerHour!;

        return {
            user: r.user,
            bike: r.bike,
            startAt: startAt,
            endAt: endAt,
            totalCost: totalCost,
            description: r.description
        };
    });

    const rentalInserted = await RentalModel.insertMany(rentalDocs);
    console.log(`Inserted rentals: ${rentalInserted.length}`);

    // issues
    const issuesToCreate = [
        { user: regularUsers[1]!._id, bike: availableBikes[3]!._id, reportedMinAgo: 60 * 24 * 10, description: "Skripi lanac pri vecoj brzini" },
        { user: regularUsers[1]!._id, bike: availableBikes[4]!._id, reportedMinAgo: 60 * 24 * 8,  description: "Kocnice slabe, potrebno podesavanje" },
        { user: regularUsers[2]!._id, bike: availableBikes[5]!._id, reportedMinAgo: 60 * 24 * 6,  description: "Zadnja guma je poluprazna" },
        { user: regularUsers[2]!._id, bike: availableBikes[3]!._id, reportedMinAgo: 60 * 24 * 4,  description: "Sediste se spusta tokom voznje" },
        { user: regularUsers[2]!._id, bike: availableBikes[4]!._id, reportedMinAgo: 60 * 24 * 2,  description: "Lanac spada u nizem prenosu" }
    ];

    const issueDocs = issuesToCreate.map(x => ({
        user: x.user,
        bike: x.bike,
        reportedAt: new Date(now.getTime() - x.reportedMinAgo * 60 * 1000),
        description: x.description
    }));

    const issueInserted = await IssueModel.insertMany(issueDocs);
    console.log(`Inserted issues: ${issueInserted.length}`);

    // images
    const imageRows = [];

    for (const r of rentalInserted) {
        imageRows.push(
            { ownerId: r._id, ownerModel: "Rental", takenAt: r.endAt, path: DEFAULT_IMAGE },
            { ownerId: r._id, ownerModel: "Rental", takenAt: r.endAt, path: DEFAULT_IMAGE }
        );
    }
    for (const i of issueInserted) {
        imageRows.push(
            { ownerId: i._id, ownerModel: "Issue", takenAt: i.reportedAt, path: DEFAULT_IMAGE },
            { ownerId: i._id, ownerModel: "Issue", takenAt: i.reportedAt, path: DEFAULT_IMAGE }
        );
    }

    const imageInserted = await ImageModel.insertMany(imageRows);
    console.log(`Inserted images: ${imageInserted.length}`);

    // logging
    console.log("DB init done");
}

main()
    .catch((e) => {
        console.error("db-init failed:", e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close();
    });
