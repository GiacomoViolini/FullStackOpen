import { useEffect, useState } from "react";
import backend from "./backend";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    backend.getAll().then((c) => setCountries(countries.concat(c)));
  }, []);

  const countriesToShow = countries.filter((c) =>
    c.name.common.toUpperCase().includes(search.toUpperCase())
  );

  useEffect(() => {
    const fetchWeather = () => {
      return backend.getWeather(countriesToShow[0].capital[0]);
    };
    if (countriesToShow.length === 1)
      fetchWeather()
        .then((w) => setWeather(w))
        .catch((e) => console.log(e));
    console.log(countriesToShow.length, weather);
  }, [search]);

  return (
    <>
      <div>
        find countries
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
      </div>
      {countriesToShow.length >= 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : countriesToShow.length !== 1 ? (
        <>
          {countriesToShow.map((c) => (
            <div key={c.name.common}>
              {c.name.common}
              <button onClick={() => setSearch(c.name.common)}>show</button>
            </div>
          ))}
        </>
      ) : (
        <div>
          <h2>{countriesToShow[0].name.common}</h2>
          <p>capital {countriesToShow[0].capital}</p>
          <p>area {countriesToShow[0].area}</p>
          <h3>languages:</h3>
          <ul>
            {Object.values(countriesToShow[0].languages).map((l) => {
              return <li key={l}>{l}</li>;
            })}
          </ul>
          <img width="193" height="130" src={countriesToShow[0].flags.svg} />
          <h2>Weather in {countriesToShow[0].capital} </h2>

          {weather && (
            <div>
              <p>temperature {weather.current.temp_c} Celsius</p>
              <img src={weather.current.condition.icon} />
              <p>{(weather.current.wind_kph / 3.6).toFixed(2)} m/s</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default App;
