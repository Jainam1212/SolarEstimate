"use client";

import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

export const MapPolygon = ({ paths, options }) => {
  const map = useMap();
  const polygonRef = useRef(null);
  useEffect(() => {
    if (!map) return;

    polygonRef.current = new window.google.maps.Polygon({
      ...options,
      paths,
      map,
    });
    return () => {
      polygonRef.current?.setMap(null);
      polygonRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (polygonRef.current) {
      polygonRef.current.setPaths(paths);
      polygonRef.current.setOptions(options);
    }
  }, [paths, options]);

  return null;
};
