import React from 'react';
import HomeSectionTitle from './HomeSectionTitle';

type HourPoint = {
  label: string;
  value: number;
};

type ForecastDay = {
  id: string;
  label: string;
  icon: string;
  high: number;
  low: number;
  isActive?: boolean;
};

type CityWeather = {
  id: string;
  city: string;
  temp: number;
  precipitation: string;
  humidity: string;
  wind: string;
  image: string;
  gradient: string;
  icon: string;
};

type WeatherSectionProps = {
  mainCity: {
    city: string;
    datetime: string;
    temp: number;
    weatherIcon: string;
    precipitation: string;
    humidity: string;
    wind: string;
  };
  hourly: HourPoint[];
  weekly: ForecastDay[];
  cities: CityWeather[];
};

const WeatherSection: React.FC<WeatherSectionProps> = ({
  mainCity,
  hourly,
  weekly,
  cities,
}) => {
  const chartPoints = hourly
    .map((point, index) => {
      const x = (index / (hourly.length - 1)) * 100;
      const y = 100 - ((point.value - 15) / 20) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <section className="space-y-6">
      <HomeSectionTitle title="clima" />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={mainCity.weatherIcon}
                alt="Condição atual"
                className="h-14 w-14"
                loading="lazy"
              />
              <div>
                <p className="text-5xl font-light text-dark">{mainCity.temp}°C</p>
                <div className="text-xs text-dark-75">
                  <p>Precipitação: {mainCity.precipitation}</p>
                  <p>Umidade: {mainCity.humidity}</p>
                  <p>Vento: {mainCity.wind}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-medium text-dark">{mainCity.city}</p>
              <p className="text-sm text-dark-50">{mainCity.datetime}</p>
            </div>
          </div>

          <div className="mt-6">
            <svg viewBox="0 0 100 40" className="h-32 w-full">
              <polyline
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2"
                points={chartPoints}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="mt-2 flex items-center justify-between text-xs text-dark-75">
              {hourly.map((point) => (
                <span key={point.label}>{point.label}</span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3 overflow-x-auto">
            {weekly.map((day) => (
              <div
                key={day.id}
                className={`flex h-28 w-20 flex-shrink-0 flex-col items-center justify-between rounded-2xl px-2 py-3 text-center ${
                  day.isActive ? 'bg-gray' : 'bg-gray/50'
                }`}
              >
                <p className="text-sm font-medium text-dark">{day.label}</p>
                <img src={day.icon} alt={`${day.label} previsão`} className="h-10 w-10" />
                <p className="text-xs text-dark">
                  {day.high}° <span className="text-dark-50">{day.low}°</span>
                </p>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {cities.map((city) => (
            <article
              key={city.id}
              className="relative overflow-hidden rounded-2xl text-white shadow-card"
            >
              <img
                src={city.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" aria-hidden="true" />
              <div className="relative z-10 flex h-full flex-col justify-between p-5">
                <div className="text-right">
                  <p className="text-lg font-medium capitalize">{city.city}</p>
                  <p className="text-xs opacity-90">{mainCity.datetime}</p>
                </div>
                <div className="flex items-center gap-3">
                  <img src={city.icon} alt="" className="h-12 w-12" />
                  <div>
                    <p className="text-4xl font-light">{city.temp}°C</p>
                    <div className="text-xs">
                      <p>Precipitação: {city.precipitation}</p>
                      <p>Umidade: {city.humidity}</p>
                      <p>Vento: {city.wind}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export type { HourPoint, ForecastDay, CityWeather };
export default WeatherSection;

