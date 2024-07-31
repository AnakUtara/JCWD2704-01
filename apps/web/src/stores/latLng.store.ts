import { getDetails } from "use-places-autocomplete";
import { create } from "zustand";

type State = {
  latLng: { lat: number; lng: number };
  location: google.maps.GeocoderResult | null;
  results: google.maps.places.PlaceResult | null;
  isLoaded: boolean;
};
type Action = { setLocation: (latLng: State["latLng"]) => void; setIsLoaded: (isLoaded: boolean) => void };
type LatLngStore = State & Action;

export const useLocation = create<LatLngStore>()((set) => ({
  location: null,
  isLoaded: false,
  results: null,
  latLng: { lat: 0, lng: 0 },
  setLocation: async (latLng: State["latLng"]) => {
    set({ latLng });
    try {
      const geocoder = new google.maps.Geocoder();
      const { results } = await geocoder.geocode({ location: latLng, region: "id" });
      const responese = (await getDetails({ placeId: results[0].place_id, region: "id" })) as google.maps.places.PlaceResult;
      if (results && results[0]) {
        set({ location: results[0], results: responese });
      } else {
        set({ location: null, results: null });
        console.log("No location found for given coordinates.");
      }
    } catch (error) {
      console.log("Error fetching location:", error);
    }
  },
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}));
