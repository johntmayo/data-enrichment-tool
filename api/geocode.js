export default async function handler(req, res) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'address query parameter is required' });
  }

  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'MAPBOX_TOKEN environment variable is not set' });
  }

  const params = new URLSearchParams({
    access_token: token,
    country: 'US',
    limit: '1'
  });
  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?${params.toString()}`;

  try {
    const upstream = await fetch(url);
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (error) {
    return res.status(502).json({
      error: 'Mapbox geocoding request failed',
      message: error.message || String(error)
    });
  }
}
