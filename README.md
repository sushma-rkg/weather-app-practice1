# weather-app-practice1

A simple weather website. You type the name of a city, press Search, and the page shows the current weather there.

## What it shows

- The city and country
- The local time
- A weather picture and a short description, like "Partly cloudy"
- The temperature in Celsius, and how warm it feels
- Humidity and wind

## Where the weather comes from

The weather data comes from [weatherapi.com](https://www.weatherapi.com/).

## Where it lives

The site is hosted on [Vercel](https://vercel.com/).

## The secret key

weatherapi.com needs a secret key. The key is stored on Vercel as an environment variable (a private setting) called `WEATHER_API_KEY`. It is never written in the code.

The page never sees the key. It asks a small function on Vercel for the weather, and that function asks weatherapi.com.
