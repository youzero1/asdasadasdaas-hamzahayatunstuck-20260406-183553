import { ForecastDay } from '@/types/weather';
import { getWeatherEmoji } from '@/lib/weatherUtils';

interface Props {
  day: ForecastDay;
}

export default function ForecastCard({ day }: Props) {
  const emoji = getWeatherEmoji(day.weatherCode, day.icon);

  return (
    <div className="forecast-card">
      <div className="forecast-day">{day.dayName}</div>
      <span className="forecast-icon">{emoji}</span>
      <div className="forecast-desc">{day.description}</div>
      <div className="forecast-temps">
        <span className="temp-high">{day.high}°</span>
        <span className="temp-low">{day.low}°</span>
      </div>
    </div>
  );
}
