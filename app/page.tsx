'use client';

import { useState, useCallback } from 'react';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastSection from '@/components/ForecastSection';
import { WeatherData, ForecastData } from '@/types/weather';

export default function HomePage() {
  const [city, setCity] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setForecastData(null);

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?city=${encodeURIComponent(cityName)}`),
        fetch(`/api/forecast?city=${encodeURIComponent(cityName)}`),
      ]);

      if (!weatherRes.ok) {
        const data = await weatherRes.json();
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      if (!forecastRes.ok) {
        const data = await forecastRes.json();
        throw new Error(data.error || 'Failed to fetch forecast data');
      }

      const weather: WeatherData = await weatherRes.json();
      const forecast: ForecastData = await forecastRes.json();

      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      setCity(trimmed);
      fetchWeather(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🌤 Weather App</h1>
        <p>Get current weather and 5-day forecast for any city</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Enter city name..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="search-btn"
          onClick={handleSearch}
          disabled={loading || !inputValue.trim()}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <span>Fetching weather data...</span>
        </div>
      )}

      {!loading && weatherData && (
        <div className="weather-card">
          <CurrentWeather data={weatherData} />
        </div>
      )}

      {!loading && forecastData && (
        <div className="forecast-section">
          <h2>5-Day Forecast</h2>
          <ForecastSection data={forecastData} />
        </div>
      )}

      {!loading && !weatherData && !error && (
        <div className="placeholder">
          <span className="placeholder-icon">🌍</span>
          <h2>Search for a city</h2>
          <p>Enter a city name above to see the current weather and 5-day forecast.</p>
        </div>
      )}
    </div>
  );
}
