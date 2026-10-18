const NOT_FOUND_MESSAGE = "We couldn't find that city. Please check the spelling and try again.";
const UNAVAILABLE_MESSAGE = "The weather service is unavailable right now. Please try again later.";

// weatherapi.com error codes: 1003 = no city given, 1006 = city not found
const CITY_PROBLEM_CODES = [1003, 1006];

module.exports = async function handler(req, res) {
  const raw = req.query.city;
  const city = typeof raw === "string" ? raw.trim() : "";

  if (!city) {
    return res.status(404).json({ error: NOT_FOUND_MESSAGE });
  }

  const key = process.env.WEATHER_API_KEY;
  if (!key) {
    return res.status(503).json({ error: UNAVAILABLE_MESSAGE });
  }

  try {
    const url =
      "https://api.weatherapi.com/v1/current.json?key=" +
      encodeURIComponent(key) +
      "&q=" +
      encodeURIComponent(city);

    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await response.json();

    if (data.error) {
      if (CITY_PROBLEM_CODES.includes(data.error.code)) {
        return res.status(404).json({ error: NOT_FOUND_MESSAGE });
      }
      return res.status(503).json({ error: UNAVAILABLE_MESSAGE });
    }

    const icon = data.current.condition.icon;

    return res.status(200).json({
      city: data.location.name,
      country: data.location.country,
      localTime: data.location.localtime,
      description: data.current.condition.text,
      icon: icon.startsWith("//") ? "https:" + icon : icon,
      temperatureC: data.current.temp_c,
      feelsLikeC: data.current.feelslike_c,
      humidity: data.current.humidity,
      windSpeedKph: data.current.wind_kph,
      windDirection: data.current.wind_dir,
    });
  } catch (error) {
    return res.status(503).json({ error: UNAVAILABLE_MESSAGE });
  }
};
