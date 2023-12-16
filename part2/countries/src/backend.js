import axios from "axios";

const getAll = () => {
  const response = axios.get(
    "https://studies.cs.helsinki.fi/restcountries/api/all"
  );
  return response.then((r) => r.data);
};

const getWeather = (capital) => {
  const API_KEY = import.meta.env.VITE_API_KEY;

  const params = {
    key: API_KEY,
    q: capital,
    aqi: "no",
  };
  const response = axios.get("http://api.weatherapi.com/v1/current.json", {
    params,
  });
  return response.then((r) => r.data);
};

export default { getAll, getWeather };
