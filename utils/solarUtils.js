import { polygon, area } from "@turf/turf";
export const SolarAreaCalculator = (coordinates) => {
  const temp = [];
  const first = [coordinates[0].location.lng, coordinates[0].location.lat];
  for (let i = 0; i < coordinates.length; i++) {
    let t = [];
    t.push(coordinates[i].location.lng);
    t.push(coordinates[i].location.lat);
    temp.push(t);
  }
  temp.push(first);
  let shape = polygon([temp]);
  const areaCovered = area(shape);
  return areaCovered;
};
