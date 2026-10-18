const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const result = document.getElementById("result");

const UNAVAILABLE_MESSAGE = "The weather service is unavailable right now. Please try again later.";

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function makeDetail(label, value) {
  const detail = document.createElement("div");
  detail.append(makeElement("span", "", label), makeElement("strong", "", value));
  return detail;
}

function showMessage(message) {
  result.replaceChildren(makeElement("p", "message", message));
}

function showWeather(weather) {
  const card = makeElement("div", "card");

  const icon = document.createElement("img");
  icon.className = "icon";
  icon.src = weather.icon;
  icon.alt = weather.description;

  const details = makeElement("div", "details");
  details.append(
    makeDetail("Feels like", Math.round(weather.feelsLikeC) + "°C"),
    makeDetail("Humidity", weather.humidity + "%"),
    makeDetail("Wind", Math.round(weather.windSpeedKph) + " km/h " + weather.windDirection)
  );

  card.append(
    makeElement("p", "city", weather.city + ", " + weather.country),
    makeElement("p", "local-time", weather.localTime),
    icon,
    makeElement("p", "temp", Math.round(weather.temperatureC) + "°C"),
    makeElement("p", "desc", weather.description),
    details
  );

  result.replaceChildren(card);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const response = await fetch("/api/weather?city=" + encodeURIComponent(cityInput.value));
    const data = await response.json();

    if (data.error) {
      showMessage(data.error);
    } else {
      showWeather(data);
    }
  } catch (error) {
    showMessage(UNAVAILABLE_MESSAGE);
  }
});
