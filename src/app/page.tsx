"use client";

import { useState, useEffect } from 'react';
import './principal.css';

interface WeatherData {
  city: {
    name: string;
  };
  list: {
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: {
      description: string;
    }[];
  }[];
}

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (city.trim() !== '') {
      fetchWeather();
    }
  }, [city]);

  const fetchWeather = async () => {
    const apiKey = 'cebcd482eda57fa9a6714c1c2ba91885';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`);
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar dados da previsão do tempo:', err);
      setError('Erro ao buscar dados da previsão do tempo. Verifique o nome da cidade e tente novamente.');
      setWeatherData(null);
    }
  };

  return (
    <div className="container">
      <h1>Previsão do Tempo</h1>
      <div className="input-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Digite o nome da cidade"
          className="input"
        />
      </div>
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-container">
          <h2>Previsão para {weatherData.city.name}</h2>
          <ul>
            {weatherData.list.map((item: any, index: number) => {
              const date = new Date(item.dt * 1000);
              return (
                <li key={index} className="weather-item">
                  <p>{date.toLocaleTimeString()}</p>
                  <p>Temperatura: {item.main.temp}°C</p>
                  <p>Min: {item.main.temp_min}°C, Max: {item.main.temp_max}°C</p>
                  <p>{item.weather[0].description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
