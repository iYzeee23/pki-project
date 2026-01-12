import type { Request, Response } from "express";
import { asyncHandler, extractAddressName, HttpError, NOMINATIM_BASE_URL, SUPPORTED_LANGUAGES_URL } from "../utils";
import { keyOf, getCached, LOCATION_CACHE_SERVER, setCached } from "@app/shared";

export class GeocodeController {
    reverse = asyncHandler(async (req, res, _next) => {
        const lng = Number(req.query.lng);
        const lat = Number(req.query.lat);

        const key = keyOf({ lng: lng, lat: lat });
        const cached = getCached(LOCATION_CACHE_SERVER, key);
        if (cached) return res.json({ label: cached });

        const lngUrl = `lon=${encodeURIComponent(lng)}`;
        const latUrl = `lat=${encodeURIComponent(lat)}`;
        const url = `${NOMINATIM_BASE_URL}&${SUPPORTED_LANGUAGES_URL}&${lngUrl}&${latUrl}`;

        const resp = await fetch(url, {
            headers: {
                "User-Agent": "pki-bikeshare/1.0 (server)",
                "Accept": "application/json",
            },
        });

        if (!resp.ok) throw new HttpError(502, "Geocoding provider error");

        const json: any = await resp.json();
        const label = json?.address ? extractAddressName(json.address) : "Unknown location";

        setCached(LOCATION_CACHE_SERVER, key, label);
        return res.json({ label: label });
    });
}
