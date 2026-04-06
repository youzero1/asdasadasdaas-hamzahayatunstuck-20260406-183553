export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  weatherCode: number;
}

export interface ForecastDay {
  dayName: string;
  high: number;
  low: number;
  description: string;
  icon: string;
  weatherCode: number;
}

export interface ForecastData {
  city: string;
  forecast: ForecastDay[];
}
