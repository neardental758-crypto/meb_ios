/**
 * 
 * Para calcular la distancia entre dos puntos utilizando la API de Distance Matrix de Google en JavaScript, 
 * puedes seguir los siguientes pasos:
 * Incluye la biblioteca de Maps JavaScript API en tu código HTML:
 */

<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>

//Crea una función en JavaScript que tome dos direcciones como entrada y devuelva la distancia entre ellas:
function getDistance(origin, destination) {
  // Crea una instancia del servicio de Distance Matrix
  var service = new google.maps.DistanceMatrixService();

  // Configura los parámetros de la solicitud
  var request = {
    origins: [origin],
    destinations: [destination],
    travelMode: 'DRIVING'
  };

  // Hace la solicitud a la API de Distance Matrix
  service.getDistanceMatrix(request, function(response, status) {
    if (status == 'OK') {
      // Obtiene la distancia y la duración del trayecto
      var distance = response.rows[0].elements[0].distance.text;
      var duration = response.rows[0].elements[0].duration.text;

      // Muestra la distancia y la duración en la consola
      console.log('Distance: ' + distance);
      console.log('Duration: ' + duration);
    }
  });
}

//Llama a la función con dos direcciones como argumentos:

getDistance('New York, NY', 'Boston, MA');
//La función hará una solicitud a la API de Distance Matrix y mostrará la distancia y la duración del trayecto en la consola.


//para importar 

/**
 * En lugar de incluir la biblioteca de Maps JavaScript API en tu código HTML, 
 * también puedes importarla en tu archivo JavaScript utilizando la función import de JavaScript. Por ejemplo:
*/

import * as google from 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';

/**
 * Con esto, puedes utilizar la biblioteca de Maps JavaScript API en tu código JavaScript de la misma manera que si la hubieras incluido en el HTML.
 *
 * Es importante tener en cuenta que esta forma de importar la biblioteca requiere que tu código JavaScript 
 * esté escrito en formato ECMAScript Module (ESM). Si tu código JavaScript está escrito en otro formato, 
 * como CommonJS, puedes utilizar la función require en su lugar:
*/

const google = require('https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places');

/**
 * También puedes descargar la biblioteca de Maps JavaScript API y guardarla en tu proyecto, y luego importarla desde tu archivo JavaScript utilizando una ruta local:
*/

import * as google from '/path/to/maps-javascript-api.js';


///YCON FETCH

async function getDistance(origin, destination) {
    // Crea la URL de la solicitud a la API de Distance Matrix
    const apiKey = 'YOUR_API_KEY';
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${apiKey}`;
  
    // Hace la solicitud a la API de Distance Matrix utilizando fetch
    const response = await fetch(url);
    const data = await response.json();
  
    // Obtiene la distancia y la duración del trayecto
    const distance = data.rows[0].elements[0].distance.text;
    const duration = data.rows[0].elements[0].duration.text;
  
    // Muestra la distancia y la duración en la consola
    console.log('Distance: ' + distance);
    console.log('Duration: ' + duration);
  }


/**
 * Realizando pruebas con distance MAtrix API
 * probando con con una matriz de 3 puntos en google clound platform equivale a una petición 1 
 * 
    let ori = '4.664454,-74.108029|4.661426,-74.116022|4.688483,-74.094746';
    let des = '4.661426,-74.116022|4.688483,-74.094746|4.676399,-74.071072';
 * 
[Sat Dec 17 2022 12:37:54.938]  LOG      DISTANCIA DESDE LA API:  {"destination_addresses": ["Cra. 72a #23f-36, Bogotá, Colombia", "Cl. 73 #72-35, Bogotá, Colombia", "Cl. 80 #54-79, Bogotá, Colombia"], "origin_addresses": ["Kr 70 C 48A - 65 Piso 1, Engativá, Bogotá, Colombia", "Cra. 72a #23f-36, Bogotá, Colombia", "Cl. 73 #72-35, Bogotá, Colombia"], "rows": [{"elements": [Array]}, {"elements": [Array]}, {"elements": [Array]}], "status": "OK"}
[Sat Dec 17 2022 12:37:54.940]  LOG      DISTANCIA DESDE LA API elementos:  
  [
    {"distance": {"text": "3.6 km", "value": 3637}, "duration": {"text": "7 mins", "value": 414}, "status": "OK"}, {"distance": {"text": "6.4 km", "value": 6390}, "duration": {"text": "15 mins", "value": 877}, "status": "OK"}, {"distance": {"text": "9.3 km", "value": 9269}, "duration": {"text": "20 mins", "value": 1213}, "status": "OK"}
  ]
[Sat Dec 17 2022 12:37:54.940]  LOG      Distance1: 3.6 km
[Sat Dec 17 2022 12:37:54.943]  LOG      Duration1: 7 mins
[Sat Dec 17 2022 12:37:54.944]  LOG      Distance2: 6.4 km
[Sat Dec 17 2022 12:37:54.945]  LOG      Duration2: 15 mins
[Sat Dec 17 2022 12:37:54.947]  LOG      Distance3: 9.3 km
[Sat Dec 17 2022 12:37:54.948]  LOG      Duration3: 20 mins


tomando el inicio y fin de la matrix obtenemos está respuesta google clound platform equivale a una petición 1 
  let ori = '4.664454,-74.108029';
  let des = '4.676399,-74.071072';

[Sat Dec 17 2022 12:41:09.428]  LOG      DISTANCIA DESDE LA API:  
{"destination_addresses": ["Cl. 80 #54-79, Bogotá, Colombia"], "origin_addresses": ["Kr 70 C 48A - 65 Piso 1, Engativá, Bogotá, Colombia"], "rows": [{"elements": [Array]}], "status": "OK"}
[Sat Dec 17 2022 12:41:09.430]  LOG      DISTANCIA DESDE LA API elementos:  
[
  {"distance": {"text": "9.3 km", "value": 9269}, "duration": {"text": "20 mins", "value": 1213}, "status": "OK"}
]
[Sat Dec 17 2022 12:41:09.431]  LOG      Distance1: 9.3 km
[Sat Dec 17 2022 12:41:09.431]  LOG      Duration1: 20 mins
 */