import { NextRequest, NextResponse } from 'next/server';
import { getMockForecast } from '@/lib/mockWeather';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === 'demo') {
    const mockData = getMockForecast(city);
    if (!mockData) {
      return NextResponse.json({ error: `City "${city}" not found. Try: London, New York, Tokyo, Paris, Sydney` }, { status: 404 });
    }
    return NextResponse.json(mockData);
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: `City "${city}" not found` }, { status: 404 });
      }
      if (response.status === 401) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Failed to fetch forecast data' }, { status: response.status });
    }

    const data = await response.json();

    const dailyMap = new Map<string, {
      date: string;
      dayName: string;
      temps: number[];
      descriptions: string[];
      icons: string[];
      weatherCodes: number[];
    }>();

    const today = new Date().toDateString();

    for (const item of data.list) {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toDateString();

      if (dateStr === today) continue;

      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, {
          date: dateStr,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          temps: [],
          descriptions: [],
          icons: [],
          weatherCodes: [],
        });
      }

      const day = dailyMap.get(dateStr)!;
      day.temps.push(Math.round(item.main.temp));
      day.descriptions.push(item.weather[0].description);
      day.icons.push(item.weather[0].icon);
      day.weatherCodes.push(item.weather[0].id);
    }

    const forecastDays = Array.from(dailyMap.values()).slice(0, 5).map((day) => ({
      dayName: day.dayName,
      high: Math.max(...day.temps),
      low: Math.min(...day.temps),
      description: day.descriptions[Math.floor(day.descriptions.length / 2)],
      icon: day.icons[Math.floor(day.icons.length / 2)],
      weatherCode: day.weatherCodes[Math.floor(day.weatherCodes.length / 2)],
    }));

    return NextResponse.json({ city: data.city.name, forecast: forecastDays });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
