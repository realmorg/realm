const CONDITIONS = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Freezing fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌦️" },
  56: { label: "Freezing drizzle", icon: "🌧️" },
  57: { label: "Freezing drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Freezing rain", icon: "🌧️" },
  67: { label: "Freezing rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "🌨️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "🌨️" },
  80: { label: "Rain showers", icon: "🌦️" },
  81: { label: "Rain showers", icon: "🌧️" },
  82: { label: "Violent showers", icon: "⛈️" },
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Snow showers", icon: "❄️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Thunderstorm with hail", icon: "⛈️" },
};

const UNKNOWN = { label: "Unknown", icon: "🌡️" };

export const condition = (code) => CONDITIONS[code] ?? UNKNOWN;

const weekday = (date, index) =>
  index === 0 ? "Today" : new Date(`${date}T00:00`).toLocaleDateString("en", { weekday: "short" });

export const placeLabel = (place) =>
  [place.name, place.admin1, place.country].filter(Boolean).join(", ");

export const currentConditions = (data) => {
  if (!data?.current) return null;
  const { current, current_units: units } = data;
  return {
    ...condition(current.weather_code),
    temperature: `${Math.round(current.temperature_2m)}${units.temperature_2m}`,
    feelsLike: `${Math.round(current.apparent_temperature)}${units.apparent_temperature}`,
    humidity: `${current.relative_humidity_2m}${units.relative_humidity_2m}`,
    wind: `${Math.round(current.wind_speed_10m)} ${units.wind_speed_10m}`,
  };
};

export const dailyForecast = (data) => {
  if (!data?.daily) return [];
  const { daily, daily_units: units } = data;
  return daily.time.map((date, index) => ({
    date,
    day: weekday(date, index),
    ...condition(daily.weather_code[index]),
    high: Math.round(daily.temperature_2m_max[index]),
    low: Math.round(daily.temperature_2m_min[index]),
    highText: `${Math.round(daily.temperature_2m_max[index])}${units.temperature_2m_max}`,
    lowText: `${Math.round(daily.temperature_2m_min[index])}${units.temperature_2m_min}`,
    rain: `${daily.precipitation_probability_max[index] ?? 0}%`,
  }));
};
