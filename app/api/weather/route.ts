import { NextRequest, NextResponse } from 'next/server';
import { getMockWeather } from '@/lib/mockWeather';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === 'demo') {
    const mockData = getMockWeather(city);
    if (!mockData) {
      return NextResponse.json({ error: `City "${city}" not found. Try: London, New York, Tokyo, Paris, Sydney` }, { status: 404 });
    }
    return NextResponse.json(mockData);
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: `City "${city}" not found` }, { status: 404 });
      }
      if (response.status === 401) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      weatherCode: data.weather[0].id,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
