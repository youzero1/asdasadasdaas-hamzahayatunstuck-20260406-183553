import { ForecastData } from '@/types/weather';
import ForecastCard from '@/components/ForecastCard';

interface Props {
  data: ForecastData;
}

export default function ForecastSection({ data }: Props) {
  return (
    <div className="forecast-grid">
      {data.forecast.map((day, index) => (
        <ForecastCard key={index} day={day} />
      ))}
    </div>
  );
}
