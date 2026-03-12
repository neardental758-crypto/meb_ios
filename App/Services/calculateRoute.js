import { Env } from "../../keys";
import polyline from '@mapbox/polyline';
import { point, nearestPointOnLine, distance, lineString } from '@turf/turf';

export async function calculatePolylineToSave(position1, position2){      
    const keyMap = Env.key_map_google
    const origin = { latitude: position1.lat || position1.latitude, longitude: position1.lng || position1.longitude};
    const destination = { latitude: position2.lat || position2.latitude, longitude: position2.lng || position2.longitude};
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${keyMap}`);
      if (!response.ok) {
        throw new Error('Error al obtener la ruta');
      }
      const data = await response.json();
      if (data.status === "OK") {
        const points = data.routes[0].overview_polyline.points;
        return points;
      } else {
        console.error("Error al obtener la ruta:", data.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

export async function calcularDistanciaPerpendicularPuntoRuta(puntoExterior, ruta) {
    const coordenadasLista = [puntoExterior.lat, puntoExterior.lng];
    const decodedPolyline = polyline.decode(ruta);
    const rutaString = lineString(decodedPolyline);
    const punto = point(coordenadasLista);
    const nearest = nearestPointOnLine(rutaString, punto);
    const distancia = distance(punto, nearest, { units: 'kilometers' });
    return distancia;
}

export async function calcularDistanciaEntreDosPuntos(position1, position2) {
  const punto1 = point([position1.lng || position1.longitude, position1.lat || position1.latitude]);
  const punto2 = point([position2.lng || position2.longitude, position2.lat || position2.latitude]);
  const distancia = distance(punto1, punto2, { units: 'kilometers' });
  return distancia;
}