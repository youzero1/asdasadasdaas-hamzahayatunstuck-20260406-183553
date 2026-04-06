import { WeatherData, ForecastData } from '@/types/weather';

const CITIES: Record<string, { lat: number; lon: number; country: string }> = {
  london: { lat: 51.5, lon: -0.12, country: 'GB' },
  'new york': { lat: 40.71, lon: -74.0, country: 'US' },
  newyork: { lat: 40.71, lon: -74.0, country: 'US' },
  tokyo: { lat: 35.68, lon: 139.69, country: 'JP' },
  paris: { lat: 48.85, lon: 2.35, country: 'FR' },
  sydney: { lat: -33.87, lon: 151.21, country: 'AU' },
  berlin: { lat: 52.52, lon: 13.4, country: 'DE' },
  dubai: { lat: 25.2, lon: 55.27, country: 'AE' },
  moscow: { lat: 55.75, lon: 37.62, country: 'RU' },
  mumbai: { lat: 19.08, lon: 72.88, country: 'IN' },
  toronto: { lat: 43.65, lon: -79.38, country: 'CA' },
  chicago: { lat: 41.85, lon: -87.65, country: 'US' },
  losangeles: { lat: 34.05, lon: -118.24, country: 'US' },
  'los angeles': { lat: 34.05, lon: -118.24, country: 'US' },
};

const WEATHER_PRESETS = [
  { code: 800, description: 'clear sky', icon: '01d' },
  { code: 801, description: 'few clouds', icon: '02d' },
  { code: 802, description: 'scattered clouds', icon: '03d' },
  { code: 500, description: 'light rain', icon: '10d' },
  { code: 200, description: 'thunderstorm', icon: '11d' },
  { code: 600, description: 'light snow', icon: '13d' },
  { code: 741, description: 'foggy', icon: '50d' },
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getBaseTemp(cityKey: string): number {
  const temps: Record<string, number> = {
    london: 12,
    'new york': 15,
    newyork: 15,
    tokyo: 18,
    paris: 14,
    sydney: 22,
    berlin: 11,
    dubai: 35,
    moscow: 5,
    mumbai: 30,
    toronto: 10,
    chicago: 13,
    losangeles: 24,
    'los angeles': 24,
  };
  return temps[cityKey] ?? 20;
}

export function getMockWeather(city: string): WeatherData | null {
  const key = city.toLowerCase().trim();
  const cityData = CITIES[key];

  if (!cityData) return null;

  const seed = key.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = seededRandom(seed);
  const presetIndex = Math.floor(rand * WEATHER_PRESETS.length);
  const preset = WEATHER_PRESETS[presetIndex];
  const baseTemp = getBaseTemp(key);
  const temp = Math.round(baseTemp + (rand * 10 - 5));
  const humidity = Math.round(40 + rand * 50);
  const windSpeed = Math.round(5 + rand * 30);

  const formattedCity = city
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return {
    city: formattedCity,
    country: cityData.country,
    temperature: temp,
    feelsLike: temp - Math.round(rand * 4),
    humidity,
    windSpeed,
    description: preset.description,
    icon: preset.icon,
    weatherCode: preset.code,
  };
}

export function getMockForecast(city: string): ForecastData | null {
  const key = city.toLowerCase().trim();
  const cityData = CITIES[key];

  if (!cityData) return null;

  const baseTemp = getBaseTemp(key);
  const seed = key.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date().getDay();
  const dayNames = days;

  const forecast = Array.from({ length: 5 }, (_, i) => {
    const dayIndex = (today + i + 1) % 7;
    const rand = seededRandom(seed + i * 17);
    const presetIndex = Math.floor(rand * WEATHER_PRESETS.length);
    const preset = WEATHER_PRESETS[presetIndex];
    const variation = rand * 14 - 7;
    const high = Math.round(baseTemp + variation + 3);
    const low = Math.round(baseTemp + variation - 4);

    return {
      dayName: dayNames[dayIndex],
      high,
      low,
      description: preset.description,
      icon: preset.icon,
      weatherCode: preset.code,
    };
  });

  const formattedCity = city
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return {
    city: formattedCity,
    forecast,
  };
}
