# RoboRoute traffic-aware routing

## Current implementation batch

- Keeps the existing Leaflet map and its standard, satellite and terrain layers.
- Keeps the existing Nigeria-wide Photon place lookup.
- Adds a separate Mapbox Directions module using the `mapbox/driving-traffic` profile.
- Requests up to two alternative routes, turn-by-turn steps, route geometry, and per-road-segment congestion annotations.
- Displays estimated duration, distance, arrival time, and a congestion summary for each route.
- Colours route segments by provider congestion level: green (low), yellow (moderate), red (heavy), dark red (severe).
- Makes route selection interactive and shows directions for the selected option.

## Provider and coverage

Mapbox's official traffic coverage documentation lists Nigeria. The provider says its live speeds are based on observations from the last 15 minutes; where live observations are unavailable, typical historical traffic is used. Therefore the UI must call these estimates traffic-aware, not guarantee live observations on every road.

Official references:
- https://docs.mapbox.com/api/navigation/directions/
- https://docs.mapbox.com/help/dive-deeper/directions/
- https://www.mapbox.com/pricing

## Token configuration

The page contains an empty `meta[name="mapbox-public-token"]` slot. Add a **public** Mapbox token there only after configuring the token in the Mapbox account:

1. Create a token intended for browser use (public token, not a secret token).
2. Restrict allowed URLs to the deployed Portfolio Labs origin and the exact local development origin only when needed.
3. Grant only the minimum scopes needed for Directions API read access.
4. Paste the public token into the meta tag's `content` value.
5. Never paste a secret token, secret key, or Supabase service-role key into this repository.

Public tokens are designed to be visible in browser code. URL restrictions and minimal scopes are still important. Monitor account usage and set available usage notifications/limits before public launch.

## Pricing snapshot checked 25 November 2026

Mapbox currently lists the Directions API at:
- Up to 100,000 requests per month: free.
- 100,001–500,000: USD $2 per 1,000 requests.
- 500,001–1,000,000: USD $1.60 per 1,000.
- 1,000,001–5,000,000: USD $1.20 per 1,000.

Pricing can change; recheck the official pricing page before launch. Each route search makes one Directions API request regardless of the number of returned alternatives, but geocoding still uses the existing Photon service.

## Verification required before production

- Configure a restricted public token.
- Test representative routes in Lagos, Ibadan, Abuja, Port Harcourt, and Kano.
- Confirm whether each route returns live observations or falls back to typical traffic; the current API response provides congestion annotations, but the UI does not claim a live-observation timestamp per segment.
- Compare route alternatives, route geometry, directions, and arrival estimates against a trusted navigation app.
- Test unknown locations, no-route responses, network failures, narrow mobile screens, and missing token.
- Confirm Mapbox usage monitoring and provider terms before making the feature public.

## Important limits

- This is route planning, not continuous turn-by-turn GPS navigation or voice guidance.
- Traffic coverage varies at road level even though Nigeria is listed in the country coverage table.
- Road incidents and closures are not separately presented in this first batch.
- Bus-stop data and public-transport routing remain planned work; they are not removed from the roadmap.
