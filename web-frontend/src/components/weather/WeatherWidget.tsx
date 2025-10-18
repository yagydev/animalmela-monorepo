'use client';

import React, { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  location: string;
}

interface WeatherWidgetProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  className?: string;
}

export default function WeatherWidget({ coordinates, className = '' }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/weather?lat=${coordinates.lat}&lng=${coordinates.lng}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [coordinates.lat, coordinates.lng]);

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
          <span>Loading weather...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg ${className}`}>
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Weather data unavailable</span>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  return (
    <div className={`bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getWeatherIcon(weather.icon)}</span>
          <div>
            <h3 className="font-semibold text-lg">{weather.location}</h3>
            <p className="text-blue-100 text-sm capitalize">{weather.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{Math.round(weather.temperature)}°C</div>
          <div className="text-blue-100 text-sm">Feels like {Math.round(weather.feelsLike)}°C</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center">
          <span className="mr-2">💧</span>
          <span>{weather.humidity}% humidity</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">💨</span>
          <span>{weather.windSpeed} m/s wind</span>
        </div>
      </div>
    </div>
  );
}
