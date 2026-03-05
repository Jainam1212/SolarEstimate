"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { Button } from "./ui/button";
import { useMarkers } from "@/store/geoLocation";
import { useEstimateInfo } from "@/store/estimateData";
import { errorToast } from "@/utils/toaster";
import { SolarAreaCalculator } from "@/utils/solarUtils";
import { ToastContainer } from "react-toastify";
import { callGemini } from "@/utils/geminiFunction";

export const PlaceAutocomplete = ({ onEstimateSaved }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const [calculatingEstimaate, setCalculatingEstimate] = useState(false);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");
  const map = useMap();

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();

      if (place.geometry?.location) {
        map?.panTo(place.geometry.location);
        map?.setZoom(17);
      }
    });
  }, [placeAutocomplete, map]);
  const markers = useMarkers((state) => state.locations);
  const setEstimate = useEstimateInfo((state) => state.setEstimateData);
  const handleEstimate = async (e) => {
    const userInfo = await fetch("/api/users", { method: "GET" });
    const temp = await userInfo.json();
    if (!temp.success.user.isAddressDataAvailable) {
      errorToast(
        "First update your address in your profile to calculate the estimate",
        5000,
      );
      return;
    }
    if (markers.length < 3) {
      errorToast("atleast 3 coordinates are required");
      return;
    }
    const area = SolarAreaCalculator(markers);

    const reqBody = {
      locationPointers: markers,
      estimateData: {},
    };
    let geminiOutput;
    try {
      setCalculatingEstimate(true);
      geminiOutput = await callGemini(markers, area);
    } catch (error) {
      console.error(error);
    }
    setCalculatingEstimate(false);
    reqBody.estimateData = JSON.parse(geminiOutput);

    setEstimate(JSON.parse(geminiOutput));

    const res = await fetch("/api/estimate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
      credentials: "include",
    });
    if (res.ok) {
      onEstimateSaved();
    }
  };

  return (
    <div className="mb-4 flex flex-row justify-between items-center">
      <ToastContainer />
      <input
        ref={inputRef}
        className="w-[70%] p-3 rounded-lg border border-gray-300 shadow-sm text-black focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Search for your rooftop..."
      />
      <Button
        className={"w-1/4"}
        onClick={(e) => {
          handleEstimate(e);
        }}
        disabled={calculatingEstimaate}
      >
        {" "}
        {calculatingEstimaate
          ? "Calculating Estimates..."
          : "Get Estimate"}{" "}
      </Button>
    </div>
  );
};
