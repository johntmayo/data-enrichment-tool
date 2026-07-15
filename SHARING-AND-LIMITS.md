# Sharing the data enrichment tool — usage limits and cost considerations

Notes for when you're ready to share this tool with partner organizations.

---

## APN lookup — LA County ArcGIS

**Cost:** Free. No API key required.

**Limits:** The LA County parcel service is a public government API and doesn't publish hard rate limits. The tool already adds a 260ms delay between address requests to be respectful of the service.

**Risk:** Low. If a dozen organizations run large batches at the same time, you might see occasional slowdowns or transient errors, but you're unlikely to get blocked. Individual failures just show up as "review" rows — users can fall back to the [LA County Assessor Portal](https://portal.assessor.lacounty.gov/) for those.

---

## Geocoding — Mapbox

**Cost:** Mapbox's free tier covers 100,000 geocoding requests per month. After that, roughly $0.50 per 1,000 requests.

**Key point:** Your Mapbox token is stored in Vercel as an environment variable. All geocoding requests from all users run against your account. If partners run large batches regularly, you absorb the cost.

**Risk:** Medium. A dozen organizations each running occasional small batches will likely stay within the free tier. The risk grows if:
- Partners start running large files (thousands of addresses at a time)
- Usage becomes regular and frequent rather than occasional

Mapbox does not support hard spending caps — only billing alerts.

---

## Recommended steps before sharing widely

1. **Set a Mapbox billing alert.** Go to your Mapbox account billing settings and add an email alert at a threshold you're comfortable with (e.g. $10–25/month). This gives you visibility before costs accumulate.

2. **Communicate batch size expectations to partners.** If organizations understand the tool is designed for enriching working lists (dozens to low hundreds of addresses), not bulk geocoding entire datasets, that keeps usage reasonable.

---

## If you want zero geocoding cost exposure

Replace the Mapbox geocoder with the **US Census Bureau geocoder** (`geocoding.geo.census.gov`). It is:

- Completely free
- No API key required
- Reliable for US addresses
- Run by the federal government — no third-party dependency

The tradeoffs:
- Slower than Mapbox
- Less forgiving of messy or incomplete addresses
- Returns slightly less precise coordinates in some cases

To make this switch, the `api/geocode.js` Vercel function would be replaced with a direct call to the Census API (no backend needed — it can be called from the browser directly). This would also eliminate the need for the `MAPBOX_TOKEN` environment variable in Vercel entirely.

---

## Summary

| Service | Cost | Key required | Main risk |
|---|---|---|---|
| LA County APN lookup | Free | No | Occasional throttling under heavy concurrent load |
| Mapbox geocoding | Free up to 100k/month, then ~$0.50/1k | Yes (your key) | Unexpected cost if partners run large batches |
| Census geocoder (alternative) | Free, unlimited | No | Slower, less tolerant of messy input |
