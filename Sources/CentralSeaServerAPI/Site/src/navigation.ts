import { API, Endpoint } from "./API";

const homeButton = document.getElementById("home") as HTMLButtonElement;
function homeHandler() { window.location.href = API.URLFor(Endpoint.Home) }
homeButton.addEventListener("click", homeHandler);
homeButton.addEventListener("touchstart", homeHandler);
const mapsButton = document.getElementById("maps") as HTMLButtonElement;
function mapsHandler() { window.location.href = API.URLFor(Endpoint.Maps) }
mapsButton.addEventListener("click", mapsHandler);
mapsButton.addEventListener("touchstart", mapsHandler);
const marketButton = document.getElementById("market") as HTMLButtonElement;
function marketHandler() { window.location.href = API.URLFor(Endpoint.Market) }
marketButton.addEventListener("click", marketHandler);
marketButton.addEventListener("touchstart", marketHandler);
const infoButton = document.getElementById("info") as HTMLButtonElement;
function infoHandler() { window.location.href = API.URLFor(Endpoint.Info) }
infoButton.addEventListener("click", infoHandler);
infoButton.addEventListener("touchstart", infoHandler);
