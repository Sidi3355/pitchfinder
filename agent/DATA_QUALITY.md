# Data quality

Generated 2026-09-12T12:40:56.646Z by `scripts/audit-data.mjs`.
Dataset generated 2026-09-12T12:40:24.496Z.

## Pitches

| Metric                                 | Count | Share |
| -------------------------------------- | ----- | ----- |
| Venues                                 | 1588  |       |
| cage                                   | 311   | 19.6% |
| astro                                  | 192   | 12.1% |
| commercial                             | 17    | 1.1%  |
| park                                   | 1068  | 67.3% |
| Collapsed venues (more than one pitch) | 538   | 33.9% |
| Name from curated                      | 26    | 1.6%  |
| Name from park                         | 1042  | 65.6% |
| Name from osm                          | 134   | 8.4%  |
| Name from road                         | 380   | 23.9% |
| Name from area                         | 6     | 0.4%  |
| No name at all                         | 0     | 0.0%  |
| Surface not known                      | 746   | 47.0% |
| Floodlights not known                  | 1054  | 66.4% |
| No postcode                            | 125   | 7.9%  |
| Same name within 200 m                 | 0     |       |

## Curated venues

26 venues. Unverified facts: **143** (postcode, address, verified date, price source, price dated within 60 days, booking URL returns 200, coordinate within 150 m of the postcode).

| Venue                                 | Missing or failing                                                 | Booking URL                                  | Coordinate  |
| ------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------- | ----------- |
| Powerleague Shoreditch                | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 403                                          | no postcode |
| Powerleague Vauxhall                  | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 403                                          | no postcode |
| Powerleague Wembley                   | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 403                                          | no postcode |
| Powerleague Mill Hill                 | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 403                                          | no postcode |
| Powerleague Barnet                    | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 403                                          | no postcode |
| Powerleague Croydon                   | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 403                                          | no postcode |
| Powerleague Canary Wharf              | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 403                                          | no postcode |
| Goals Beckenham                       | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Goals Bexleyheath                     | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Goals Dagenham                        | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Goals Ruislip                         | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Goals Hayes                           | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Goals Gillette Corner                 | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Goals Chingford                       | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Goals Sutton                          | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Westway Sports Centre                 | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 403                                          | no postcode |
| Mile End Stadium pitches              | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Battersea Park Millennium Arena       | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 202                                          | no postcode |
| Paddington Recreation Ground          | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 403                                          | no postcode |
| Talacre Community Sports Centre       | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Crystal Palace National Sports Centre | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 0 (working: https://www.better.org.uk/)      | no postcode |
| Black Prince Trust Hub                | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Coram's Fields pitches                | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 0 (working: https://coramsfields.org/)       | no postcode |
| Hackney Marshes                       | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Regent's Park Hub                     | postcode, address, verifiedAt, priceDated, coordinateOk            | 200                                          | no postcode |
| Market Road Football Cages            | postcode, address, verifiedAt, priceDated, bookingOk, coordinateOk | 404 (working: https://www.islington.gov.uk/) | no postcode |

## History

| Date       | Venues | Unnamed | No surface | No lights | No postcode | Duplicates | Unverified curated facts | Stale prices | Dead URLs | Coord mismatches |
| ---------- | ------ | ------- | ---------- | --------- | ----------- | ---------- | ------------------------ | ------------ | --------- | ---------------- |
| 2026-09-11 | 1586   | 0       | 744        | 1051      | 125         | 0          | 152                      | 26           | 22        | 0                |
| 2026-09-12 | 1588   | 0       | 746        | 1054      | 125         | 0          | 143                      | 26           | 13        | 0                |
