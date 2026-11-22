# Genie: Frappe utility apps bundle (feature catalogue)

Source: genie_utility, ghost, google_services and property_details (HEAD of each bare repo under benches/.sources/genie). Lower priority for mocks. Genie is a hotel search, price negotiation and lead capture product; these four apps are its back end. The customer-facing site and PWA are not in these repos.

## Contents
1. Guest identity and sign-in (ghost, genie_utility)
2. Hotel search, profiles and live rates (property_details)
3. Price negotiation (property_details, google_services)
4. Booking and payment (property_details)
5. Wholesale supplier connections (HotelBeds, Hotelston, GRNconnect)
6. Lead generation and waitlist (property_details)
7. Inspiration videos and creator payouts (property_details)
8. Shortlists (genie_utility, property_details)
9. Places, neighbourhoods and reviews (google_services)
10. AI agent bridge (property_details)
11. Settings, roles and background jobs
12. Screens for mocks
13. Planned, not yet built
14. Gaps a writer should not claim

## 1. Guest identity and sign-in
- **Guest sessions (off by default)**: Lets a visitor browse and act without signing up, using a temporary "ghost" account. Keeps the funnel open for first-time visitors. Switched on by a setting.
- **Convert guest to real user**: Turns a ghost account into a normal one when the visitor signs up, and can cancel the old guest tokens. Keeps their history.
- **One-time code by email or phone**: Sends a code (numeric or mixed, length, expiry and attempt limit are settings) and checks it. Gives passwordless sign-in.
- **Code sandbox mode (off by default)**: Accepts a fixed test code so testers can sign in without real delivery.
- **Anonymous code requests (off by default)**: Allows code requests without a known account.
- **Token login and refresh**: Issues short-lived access tokens and longer refresh tokens, with a scope setting. Keeps the app signed in.
- **Update mobile number and read own details**: Lets a signed-in guest or user fix their phone and see their profile.
- **Utility login by code**: A second, simpler email or mobile code login that creates a customer user if none exists and returns API keys and tokens.
- **Automatic guest cleanup**: Deletes expired guest accounts daily after a set number of days, and expires stale codes every ten minutes. Keeps the user list clean.

## 2. Hotel search, profiles and live rates
- **Hotel search**: Search by city or name with dates and guests, via several endpoints (GET and POST). Core of the product.
- **Hotel list by city**: Browse the hotels held for a city.
- **Property profile pages**: Amenities, room prices, availability, FAQs, reviews with sub-scores and traveller type, nearby places, helpful facts, provider ratings and provider links, saved per hotel. Gives guests the detail they need to choose.
- **Full profile in one call**: Returns everything about a hotel at once.
- **Separate calls per section**: Amenities, availability, availability with price, FAQ, reviews, surroundings.
- **Price fetch mode**: Prices can come from saved data or live from a booking site, with staleness limits in minutes, hours or days. Controls cost and freshness.
- **Data scrapers**: Pulls hotel data from Google Hotels (via a search-results API), Booking.com and Agoda and saves it. Per-section switches choose what to fetch (amenities, nearby places, reviews, room prices, FAQs, helpful facts). Master switch is on by default.
- **Rate comparison across providers**: Compares live rates from several suppliers and shows similar hotels with rates.
- **Price with markup**: Returns a room price with the business margin added.
- **Currency conversion**: Stores rates to USD, seeds defaults on migrate, lets staff set a custom rate and clear the cache.
- **Hotel CSV upload**: Staff bulk-load hotels from a file and see created counts.
- **Duplicate profile cleanup**: A script to merge duplicate property profiles.
- **Empty-result log**: Records searches that returned nothing so staff can fill gaps.
- **Provider price cache**: Stores supplier prices to avoid repeat calls.

## 3. Price negotiation
- **Negotiation request (new flow)**: A guest asks for a lower price for a room and stay, with room, board, cancellation terms, perks, guests, child ages and currency. Main revenue feature.
- **Status steps**: Pending, Price Updated, Awaiting Payment, Verified, Booked, Rejected, Expired, Re-quote.
- **Automatic supplier price (Hotelston)**: On submit, looks up a supplier price and records where the price came from (Manual or Hotelston). Staff can retry the fetch.
- **Staff pricing and messages**: Staff set the negotiated price, status and a message to the guest.
- **Send price by email**: Emails the offer to the guest; shows when it was sent and allows resend.
- **Accept, reject or cancel an offer**: Guest actions on the offer.
- **Counter offers and message thread (older flow)**: Older negotiation request with amenity asks, counter, staff response and messages.
- **Negotiation status check and my requests**: Guest sees their requests and progress.
- **Email and chat alerts**: Staff emails and optional Slack on each new request. WhatsApp fields are stored on the request.
- **Negotiate button and saved-money tracker (google_services)**: Decides when to show a negotiate button and records before price, after price, percent saved and result per user. Shows guests what they saved.
- **Staff manual confirm**: Staff can confirm a booking by hand.
- **Identify, public rate and negotiation engine**: Matches a hotel, finds the lowest public rate and starts a negotiation by code, used by agents.

## 4. Booking and payment
- **Book a negotiated stay**: Turns an accepted offer into a booking with traveller names and contact.
- **Payment via Razorpay**: Creates a payment request and sales order and handles payment events. Includes a Razorpay settings extension.
- **Booking record**: Payment status, supplier booking reference, errors, redirect link, confirmation email time and traveller list.
- **Confirmation email and staff alerts**: Sends confirmation to the guest and to listed staff emails.
- **Booking details lookup**: Guest views a booking.
- **Starting price and booking link helpers**: Gets the booking site's starting price and link parameters.

## 5. Wholesale supplier connections
- **HotelBeds**: Test or live setup with keys. Syncs countries, destinations and hotels (Thailand and Bangkok first, daily update sync). Availability, room pricing, rate check, book, view, cancel, modify, list, voucher, upsell, reference data (board types, facilities, categories, chains, currencies, images) and many log records. Large API; mostly staff or system use.
- **Hotelston**: Live rates, room grouping and matching into one room list, hourly keep-alive of the login session, and staff sign-in with a code.
- **GRNconnect**: Live rates with a staff re-sign-in page that takes a one-time code.
- **Agoda and Booking scrapers**: See section 2.

## 6. Lead generation and waitlist
- **Negotiate lead capture**: Collects phone, hotel or city, dates, guests, budget, budget tier, booking habit, rate inclusion, preferences and device and channel. Types: hotel or city. Statuses: New, In Negotiation, Offer Ready, Contacted, Booked, Closed, Cancelled.
- **Lead hotels and sales notes**: Child hotel list and notes for the sales team.
- **Lead alerts**: Email on new lead, resend, plus rate fetch and Slack message with similar hotels. Slack is off by default.
- **Lead dashboard data and report export**: Counts, pipeline, channels and a downloadable report.
- **Visitor analytics**: Sessions, events, session duration, with test numbers and blocked users (block and unblock).
- **Waitlist**: Signup with destination, hotels, dates, channel, variant, email and phone, queue number and referral code.
- **Referrals**: Friends moving the queue forward and earning a discount, with caps (settings).
- **Marketing links**: Generates tracked links.
- **Waitlist status and event log**: Guest checks status; events are logged.
- **Waitlist export and status updates**: Staff export and change status.
- **Sheets and chat hooks**: Optional webhooks to a spreadsheet and Slack channels.
- **Hotel recommendation call**: Suggests hotels for a lead.

## 7. Inspiration videos and creator payouts
- **Share a travel video**: Users submit a video link for a hotel and city with a share code.
- **Approval**: Staff approve or reject, with a reason.
- **Inspiration feed**: Public feed of approved videos.
- **Creator dashboard**: Creators see their videos and earnings.
- **Click tracking and commission**: Logs clicks and applies a commission rate when a booking is confirmed.
- **Reset test data**: Staff clear inspiration data.

## 8. Shortlists
- **Shortlist hotels**: Save and remove hotels and see the list.
- **Shortlist neighbourhoods**: Same for areas.
- **Customer shortlist (utility)**: Per-user saved places and hotels with permission rules so each user sees only their own.

## 9. Places, neighbourhoods and reviews (google_services)
- **Place records**: Name, type, rating, location, photos, reviews and review summaries synced from Google.
- **Neighbourhood cards**: Subtitle, quick tags, fit for trip, feel, safety, noise, food and essentials, guest sentiment, pros and cons, per city area. Helps guests pick where to stay.
- **Nearby suggestions and city sync**: Suggestions around a spot and syncing a city's neighbourhoods.
- **Places CSV import**: Staff import places from a file; runs on save.
- **Saved hotel searches**: Hotel search via a search-results API, with cached properties, price range and images.
- **Reviews from other sites**: Google Hotels, Google Maps, Tripadvisor, Yelp.
- **YouTube shorts and transcripts**: Finds travel videos and transcripts for a place, with an AI-written version. Videos stored with title, summary, link and thumbnail.
- **AI prompt tester**: Staff test prompts against Gemini and list models.
- **API price setting**: Stores per-call cost.

## 10. AI agent bridge
- **Run Huf agents for website users**: Lets guests and customers chat with agents even though they lack staff roles, only when the agent's own access rules allow, keeping one conversation per visitor. Protects agents from misuse.

## 11. Settings, roles and background jobs
- **Settings screens**: Ghost Settings, Negotiation Settings, Waitlist Settings, Inspiration Settings, Booking Notification Settings, Scraper Config, HotelBeds Config, Serp Api, Api Price.
- **Roles**: Negotiation dashboard is System Manager only; a GRNconnect re-sign-in page and dashboards are staff tools. Many guest endpoints are open to guests.
- **API key sign-in**: Accepts bearer keys on requests.
- **Jobs**: Hourly Hotelston keep-alive, daily HotelBeds delta sync, daily guest cleanup, ten-minute code expiry.

## 12. Screens for mocks
All routes below are Desk or website pages; guest screens live in the separate Genie front end, not in these repos.
- **Negotiation Requests (New) dashboard**, Desk page negotiation_request_new_dashboard (System Manager). Regions: title, Refresh button, status filter, table of requests with cancellation badge (green refundable, red not), per-row Edit, Send or Resend Price, Booking, Retry Hotelston Fetch; edit dialog with negotiated price, status, admin message; price-sent note.
- **GRNconnect Re-Auth**, Desk page grnconnect_reauth. Regions: credentials form, 6-digit code dialog, success alerts.
- **Lead Generation Intelligence Report**, website /lead_generation_dashboard. Regions: auto refresh countdown, period selector with custom dates, KPI tiles (leads, hotel vs city, shortlisted, guests, conversion), traffic counters, velocity chart, pipeline, channel and type donuts, destination list, top hotels, filters (search, type, status, channel, device), lead table.
- **Waitlist Dashboard**, website page waitlist_dashboard. Regions: signup trend (30 days), top channels, top destinations, settings status, lead table (ID, queue number, contact, destination, channel, variant, referrals, status, submitted, action), lead detail modal with hotel table.
- **Desk lists and forms**: Negotiation Request New, Negotiate Lead, Waitlist Lead, Inspiration Video, Hotel Booking Payment, Neighborhood Card, Place, settings singles.

## 13. Planned, not yet built
- The README describes only a test and an echo endpoint; neither is part of the real feature set. No other doc-only claims found.

## 14. Gaps a writer should not claim
- Do not claim a customer web app or PWA lives in these repos; none was found.
- Do not claim WhatsApp sending from these apps; only WhatsApp fields on requests exist.
- Do not claim card payments beyond Razorpay.
- Do not claim live prices from every supplier by default; the price mode defaults to saved data.
- Do not claim guest sessions are on; the switch is off by default.
- Do not claim Slack or sheet alerts are on; they are off by default.
- Do not claim HotelBeds covers all countries; initial sync targets Thailand.
- Do not claim hotel_booking supplier confirmation for every supplier; Hotelston booking reference is the one recorded.
