"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { PoiMarkers } from "@/components/point-marker";
import { useMarkers } from "@/store/geoLocation";
import { generateRandomString } from "@/utils/generators";
import { PlaceAutocomplete } from "@/components/location-auto-search";
import { DefaultLocationSearch } from "@/components/default-location";
import { Button } from "@/components/ui/button";
import { useEstimateInfo } from "@/store/estimateData";
import { SolarAreaCalculator } from "@/utils/solarUtils";
import { MapPolygon } from "@/components/map-visual-polygon";

export default function Home() {
  const markers = useMarkers((state) => state.locations);
  const addPointerInMap = useMarkers((state) => state.addLocation);
  const setPointerInMap = useMarkers((state) => state.setLocation);

  const [address, setAddress] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const estimate = useEstimateInfo((state) => state.estinateData);
  const setEstimate = useEstimateInfo((state) => state.setEstimateData);

  const onMapClick = useCallback(
    (event) => {
      const ltlg = event.detail.latLng;
      if (!ltlg) return;

      addPointerInMap({
        key: generateRandomString(10),
        location: { lat: ltlg.lat, lng: ltlg.lng },
      });
    },
    [addPointerInMap],
  );
  const fetchHistory = useCallback(async () => {
    const res = await fetch("/api/maps", { method: "GET" });
    const temp = await res.json();
    if (temp.success?.locations) {
      setHistoryData(temp.success.locations);
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/users", { method: "GET" });
      const temp = await res.json();
      if (temp.success.user.isAddressDataAvailable) {
        const { city, state, country } = temp.success.user.userAddress;
        const addr = city + ", " + state + ", " + country;
        setAddress(addr);
      }
    };
    fetchData();
    fetchHistory();
  }, [fetchHistory]);

  const loadPointers = (pointer, data) => {
    setPointerInMap(pointer);
    setEstimate(data);
  };

  const newEstimateHandler = () => {
    setPointerInMap([]);
    setEstimate({});
  };

  const pathForPolygon = markers.map((marker) => marker.location);

  return (
    <div className="flex flex-row justify-between">
      <div className="h-[75vh] w-[50vw]">
        <h1 className="text-center font-bold text-2xl">
          Welcome to Solar panel Estimate Provider
        </h1>

        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API}>
          <PlaceAutocomplete onEstimateSaved={fetchHistory} />
          <DefaultLocationSearch address={estimate.area || address} />
          <Map
            defaultZoom={13}
            mapId="GEO_MAP_SOLAR"
            defaultCenter={{ lat: 28.6129, lng: 77.2295 }}
            onClick={onMapClick}
          >
            <PoiMarkers pois={markers} />
            {markers.length >= 3 && (
              <MapPolygon
                paths={pathForPolygon}
                options={{
                  fillColor: "#00FF00",
                  fillOpacity: 0.3,
                  strokeColor: "#00FF00",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  clickable: false,
                }}
              />
            )}
          </Map>
        </APIProvider>
      </div>
      <div className="h-[75vh] w-[48vw] flex flex-col gap-4">
        <div className="bg-neutral-100 rounded-xl flex flex-col p-4 my-2 h-[25vh] overflow-hidden">
          <h1 className="font-bold text-lg mb-2">Estimates History</h1>
          <div className="flex gap-4 overflow-x-auto scrollbar-thin">
            {historyData.length > 0 ? (
              historyData.map((item, index) => (
                <div
                  key={index}
                  className="min-w-30 h-20 bg-white rounded-lg shadow-md flex flex-col justify-center items-center border"
                  onClick={() => {
                    loadPointers(item.userPointers, item.userEstimateData);
                  }}
                >
                  <p className="text-xs text-gray-600">Search ID {index + 1}</p>
                  <p className="text-xs text-gray-600 font-bold">
                    Area in m<sup>2</sup> -
                  </p>
                  <p className="text-xs text-gray-600 font-bold">
                    {Number(SolarAreaCalculator(item.userPointers)).toFixed(3)}
                  </p>
                </div>
              ))
            ) : (
              <div>
                <p>No history recorded</p>
              </div>
            )}
          </div>
        </div>
        <Button className={"cursor-pointer"} onClick={newEstimateHandler}>
          Calculate new estimates
        </Button>
        <div className="bg-neutral-100 rounded-xl flex flex-col p-4 my-2 h-[50vh] overflow-y-auto">
          <h1 className="font-bold text-lg mb-4">Description</h1>

          <div className="space-y-3 bg-yellow-50 p-4 rounded-lg shadow-inner">
            {Object.entries(estimate).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="font-semibold">{key}:</span>
                <span className="text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
