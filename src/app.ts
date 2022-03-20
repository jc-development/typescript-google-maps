import axios from "axios";
import "./app.css";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

type GoogleGeoCodeResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

// will be global b/c cdn in index.html
declare var google: any;

async function getGoogleKey(): Promise<string | Error> {
  return await axios
    .get("/api/getKey")
    .then((res) => res.data)
    .catch((error) => console.log(`error occurred on key fetch: ${error}`));
}

async function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;
  const apiKey = await getGoogleKey();

  if (apiKey) {
    axios
      .get<GoogleGeoCodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
          enteredAddress
        )}&key=${apiKey}`
      )
      .then((response) => {
        if (response.data.status !== "OK") {
          throw new Error("Could not retrieve location");
        }
        const coordinates = response.data.results[0].geometry.location;
        const map = new google.maps.Map(document.getElementById("map"), {
          center: coordinates,
          zoom: 8,
        });

        new google.maps.Marker({ position: coordinates, map });
      })
      .catch((error) => console.log("error: ", error));
  }
}

form.addEventListener("submit", searchAddressHandler);
