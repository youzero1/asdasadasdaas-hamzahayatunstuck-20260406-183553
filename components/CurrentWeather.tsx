import { WeatherData } from '@/types/weather';
import { getWeatherEmoji } from '@/lib/weatherUtils';

interface Props {
  data: WeatherData;
}

export default function CurrentWeather({ data }: Props) {
  const emoji = getWeatherEmoji(data.weatherCode, data.icon);

  return (
    <div className="current-weather">
      <div className="weather-main">
        <div className="weather-icon">{emoji}</div>
        <div>
          <div className="temperature">{data.temperature}°C</div>
          <div className="feels-like">Feels like {data.feelsLike}°C</div>
        </div>
      </div>
      <div className="weather-info">
        <div className="city-name">
          {data.city}, {data.country}
        </div>
        <div className="weather-desc">{data.description}</div>
        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{data.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind</span>
            <span className="detail-value">{data.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
