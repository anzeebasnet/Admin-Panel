import React, { useState, useEffect, useRef } from "react";
import mapboxgl, { GeolocateControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { debounce } from "lodash";
import { useAppSelector } from "@/lib/store/hooks";

interface Coordinates {
  lat: number;
  lon: number;
}

interface Suggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

interface Feature {
  id: string;
  type: string;
  place_type: string[];
  place_name: string;
  [key: string]: any; // Additional properties can be handled with an index signature
}

interface Data {
  features: Feature[];
}

interface MapboxComponentProps {
  setNewAddress?: (address: string) => void;
}

const MapboxComponent = ({ setNewAddress }: MapboxComponentProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 51.505,
    lon: -0.09,
  });

  const reduxAddress = useAppSelector(
    (state) => state.station.currentStation?.address
  );

  const restroAddress = useAppSelector(
    (state) => state.restaurant.currentRestro?.address
  );

  useEffect(() => {
    if (reduxAddress) {
      // Fetch coordinates for the address from Mapbox API
      const fetchCoordinatesForAddress = async () => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          reduxAddress
        )}.json?access_token=${mapboxgl.accessToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lon, lat] = data.features[0].center;
          setCoordinates({ lat, lon });
          setSearchText(data.features[0].place_name);

          // Update marker position and map center
          if (mapRef.current) {
            mapRef.current.flyTo({ center: [lon, lat], zoom: 15 });
            markerRef.current?.setLngLat([lon, lat]);
          }
        }
      };
      fetchCoordinatesForAddress();
    }
  }, [reduxAddress]);

  useEffect(() => {
    if (restroAddress) {
      // Fetch coordinates for the address from Mapbox API
      const fetchCoordinatesForAddress = async () => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          restroAddress
        )}.json?access_token=${mapboxgl.accessToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lon, lat] = data.features[0].center;
          setCoordinates({ lat, lon });
          setSearchText(data.features[0].place_name);

          // Update marker position and map center
          if (mapRef.current) {
            mapRef.current.flyTo({ center: [lon, lat], zoom: 15 });
            markerRef.current?.setLngLat([lon, lat]);
          }
        }
      };
      fetchCoordinatesForAddress();
    }
  }, [restroAddress]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get values from localStorage
      const savedLatitude = localStorage.getItem("latitude");
      const savedLongitude = localStorage.getItem("longitude");
      const savedLocation = localStorage.getItem("location");

      // Set state from localStorage if available
      if (savedLatitude && savedLongitude) {
        setCoordinates({
          lat: parseFloat(savedLatitude),
          lon: parseFloat(savedLongitude),
        });
      }
      if (savedLocation) {
        setSearchText(savedLocation);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      mapboxgl.accessToken = process.env
        .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

      // Ensure mapContainerRef.current is not null before initializing the map
      if (mapContainerRef.current === null) return;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current, // Now guaranteed not to be null
        style: "mapbox://styles/mapbox/streets-v12",
        center: [coordinates.lon, coordinates.lat],
        zoom: 15,
      });

      const marker = new mapboxgl.Marker()
        .setLngLat([coordinates.lon, coordinates.lat])
        .addTo(map);

      markerRef.current = marker;
      mapRef.current = map;

      // Add click listener to update the marker position and save to local storage
      map.on("click", async (e) => {
        const { lng, lat } = e.lngLat;
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
          setCoordinates({ lat, lon: lng });
          setSearchText(`${lat}, ${lng}`);
          localStorage.setItem("latitude", lat.toString());
          localStorage.setItem("longitude", lng.toString());

          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`;
          const response = await fetch(url);
          const data = await response.json();
          const filteredFeatures = data.features.filter(
            (feature: Feature) => !feature.place_type.includes("poi")
          );

          if (data.features && data.features.length > 0) {
            const placeName = filteredFeatures[0].place_name;
            setSearchText(placeName);
            localStorage.setItem("location", placeName);
            if (setNewAddress) {
              setNewAddress(placeName);
            }
          }
        }
      });

      // Add geolocator
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      });

      // geolocateControlRef.current = geolocateControl;

      map.addControl(geolocateControl);

      // geolocateControl.on(
      //   "load",
      //   async(e) => {

      //     const { lng, lat } = e.coords;
      //     setCoordinates({ lat, lon: lng });
      //     setSearchText(`${lat}, ${lng}`);
      //     localStorage.setItem("latitude", lat.toString());
      //     localStorage.setItem("longitude", lng.toString());

      //     // Reverse geocode the coordinates to get the place name
      //     const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`;
      //     const response = await fetch(url);
      //     const data = await response.json();
      //     console.log("location", data);

      //     if (data.features && data.features.length > 0) {
      //       const placeName = data.features[0].place_name;
      //       setSearchText(placeName);
      //       localStorage.setItem("location", placeName);
      //     }
      //   }
      // );

      return () => {
        map.remove();
      };
    }
  }, []); // Empty dependency array ensures this runs only once after the initial render

  // Debounce function setup outside of the useEffect
  const debouncedFetchSuggestions = debounce(async (value: string) => {
    if (value.trim().length < 3) return;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      value
    )}.json?autocomplete=true&access_token=${mapboxgl.accessToken}`;
    const response = await fetch(url);
    const data = await response.json();
    setSuggestions(data.features || []);
  }, 300);

  const handleChange = (value: string) => {
    setSearchText(value);
    debouncedFetchSuggestions(value);
  };

  const selectSuggestion = (suggestion: Suggestion) => {
    const [lon, lat] = suggestion.center;
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [lon, lat], zoom: 15 });
      markerRef.current?.setLngLat([lon, lat]);
    }
    setSearchText(suggestion.place_name);
    localStorage.setItem("latitude", lat.toString());
    localStorage.setItem("longitude", lon.toString());
    localStorage.setItem("location", suggestion.place_name);

    if (setNewAddress) {
      setNewAddress(suggestion.place_name);
    }
    setSuggestions([]);
  };

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search for places"
          className="my-2 p-1 w-[calc(100%)] flex h-8 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="relative ">
          {suggestions.length > 0 && (
            <ul
              style={{ listStyleType: "none", padding: 0 }}
              className="bg-white dark:bg-slate-500 absolute z-20 top-0 left-0 right-0 overflow-y-auto h-40"
            >
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => selectSuggestion(suggestion)}
                  className="cursor-pointer p-1 border-b-2 border-light-primary dark:border-dark-primary"
                  style={{ cursor: "pointer", padding: "5px" }}
                >
                  {suggestion.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div
        ref={mapContainerRef}
        style={{ height: "350px", width: "100%" }}
        className="map-container"
      />
    </div>
  );
};

export default MapboxComponent;
