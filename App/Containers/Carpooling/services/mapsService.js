import polyline from '@mapbox/polyline';

export const fetchRoutesFromGoogle = async (position1, position2, keyMap) => {
  if (!position1 || !position2) return [];

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${position1.lat},${position1.lng}&destination=${position2.lat},${position2.lng}&alternatives=true&key=${keyMap}`
    );
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes.map(route => {
        const points = polyline.decode(route.overview_polyline.points);
        const coordinates = points.map(([latitude, longitude]) => ({
          latitude,
          longitude,
        }));
        return {
          ...route,
          coordinates,
        };
      });
    } else {
      console.log("No se encontraron rutas.");
      return [];
    }
  } catch (error) {
    console.error("Error obteniendo rutas:", error);
    return [];
  }
};
