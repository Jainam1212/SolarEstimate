"use client";
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

export const PoiMarkers = (props) => {
  return (
    <>
      {props.pois.map((poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};
