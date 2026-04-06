export function getWeatherEmoji(weatherCode: number, icon: string): string {
  const isNight = icon && icon.endsWith('n');

  if (weatherCode >= 200 && weatherCode < 300) return '⛈️';
  if (weatherCode >= 300 && weatherCode < 400) return '🌦️';
  if (weatherCode >= 500 && weatherCode < 600) {
    if (weatherCode === 500) return '🌧️';
    if (weatherCode >= 502) return '🌧️';
    return '🌦️';
  }
  if (weatherCode >= 600 && weatherCode < 700) return '❄️';
  if (weatherCode >= 700 && weatherCode < 800) {
    if (weatherCode === 741) return '🌫️';
    return '🌫️';
  }
  if (weatherCode === 800) return isNight ? '🌙' : '☀️';
  if (weatherCode === 801) return isNight ? '🌙' : '🌤️';
  if (weatherCode === 802) return '⛅';
  if (weatherCode === 803 || weatherCode === 804) return '☁️';
  return '🌡️';
}
