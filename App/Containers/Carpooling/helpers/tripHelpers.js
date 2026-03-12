import { v4 as uuidv4 } from 'uuid';

const restarCincoHoras = (hora) => {
    const nuevaFecha = new Date(hora);
    nuevaFecha.setHours( nuevaFecha.getHours() - 5 );
    return nuevaFecha;
  };

export const validateTripFields = ({ vehiculoSelect, travelIn, position1, position2, asientos, checkDaviPlata, checkCash, checkNequi, tripCost, empresa, parametroPagos }) => {
  let errorMessage = '';
  if (!vehiculoSelect) errorMessage += 'Selecciona un vehículo.\n';
  if (!travelIn) errorMessage += 'Tipo de vehículo no seleccionado.\n';
  if (!position1) errorMessage += 'Selecciona un punto de partida.\n';
  if (!position2) errorMessage += 'Selecciona un punto de destino.\n';
  if (!asientos) errorMessage += 'Indica el número de asientos.\n';
  if (!checkDaviPlata && !checkCash && !checkNequi) errorMessage += 'Selecciona al menos un método de pago.\n';
  if (empresa?.[0]?.emp_costo && tripCost > empresa[0].emp_costo) {
    errorMessage += `El aporte máximo es de $${empresa[0].emp_costo}.\n`;
  }
  console.log('parametrosPagos', parametroPagos)
  return errorMessage || null;
};

export const buildTripObject = async ({
  infoUser,
  parametroPagos,
  searchQuery,
  searchQueryDestiny,
  directionNameUser,
  outHour,
  vehiculoSelect,
  asientos,
  routes,
  selectedRouteIndex,
  position1,
  position2,
  tripCost,
  checkDaviPlata,
  checkCash,
  checkNequi,
  calcularDistanciaEntreDosPuntos,
}) => {
  const now = new Date();
  const metodoPagos = [
    checkDaviPlata ? 'Daviplata' : null,
    checkCash ? 'Efectivo' : null,
    checkNequi ? 'Nequi' : null,
  ].filter(Boolean);

  return {
    _id: uuidv4(),
    idOrganizacion: infoUser.DataUser.organizationId,
    lSalida: searchQuery || directionNameUser,
    llegada: searchQueryDestiny || directionNameUser,
    conductor: infoUser.DataUser.idNumber,
    fecha: restarCincoHoras(outHour).toJSON(),
    vehiculo: vehiculoSelect,
    asientosIda: asientos,
    asientosVuelta: asientos,
    estado: 'ACTIVA',
    polilyne: routes[selectedRouteIndex].overview_polyline.points,
    coorSalida: position1,
    coorDestino: position2,
    precio: tripCost,
    distancia: await calcularDistanciaEntreDosPuntos(position1, position2),
    distanciaGoogle: routes[selectedRouteIndex].legs[0].distance.text,
    fechaCreacion: restarCincoHoras(now).toJSON(),
    duracionGoogle: routes[selectedRouteIndex].legs[0].duration.text,
    pagoAceptado: parametroPagos === 'conpagos' ? metodoPagos.join(', ') : parametroPagos
  };
};
