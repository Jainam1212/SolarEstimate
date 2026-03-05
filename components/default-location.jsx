"use client";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

export const DefaultLocationSearch = ({ address }) => {
  const map = useMap();
  const geocodingApi = useMapsLibrary("geocoding");

  useEffect(() => {
    if (!geocodingApi || !map || !address) return;

    const geocoder = new geocodingApi.Geocoder();

    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(12);
      } else {
        console.error("Geocoding failed:", status);
      }
    });
  }, [geocodingApi, map, address]);

  return null;
};
