import { Env } from "../Utils/enviroments";
let colores : any = ''

if (Env.plantilla === 'meb') {
  colores = {
    $primario: '#a1bc31',
    $primario80: 'rgba(161, 188, 49, 0.8)',
    $primario50: 'rgba(161, 188, 49, 0.5)',
    $primario20: 'rgba(161, 188, 49, 0.2)',
    $secundario: '#C4C4C4',
    $secundario80: 'rgba(196, 196, 196, 0.8)',
    $secundario50: 'rgba(196, 196, 196, 0.5)',
    $secundario20: 'rgba(196, 196, 196, 0.2)',
    $texto: '#333333',
    $texto80: 'rgba(51, 51, 51, 0.8)',
    $texto50: 'rgba(51, 51, 51, 0.5)',
    $texto20: 'rgba(51, 51, 51, 0.2)',
    $blanco: '#FFFFFF',
    $adicional: '#00A6E0',
    $adicional80: 'rgba(0, 166, 224, 0.8)',
    $adicional50: 'rgba(0, 166, 224, 0.5)',
    $adicional20: 'rgba(0, 166, 224, 0.2)',
    $disponible: '#4CAF50',
    $reservada: '#FFEB3B',
    $prestada: '#FF9800',
    $taller: '#f44336',
    $inactiva: 'black',
  }
}else if (Env.plantilla === 'ride') {
  colores = {
    /*$primario: '#ffdf00',
    $primario80: 'rgba(218, 56, 51, 0.8)',
    $primario50: 'rgba(218, 56, 51, 0.5)',
    $primario20: 'rgba(218, 56, 51, 0.2)',*/
    $primario: '#da3833',
    $primario80: 'rgba(255, 98, 77, 0.8)',
    $primario50: 'rgba(255, 98, 77, 0.5)',
    $primario20: 'rgba(255, 98, 77, 0.2)',
    $secundario: '#C4C4C4',
    $secundario80: 'rgba(196, 196, 196, 0.8)',
    $secundario50: 'rgba(196, 196, 196, 0.5)',
    $secundario20: 'rgba(196, 196, 196, 0.2)',
    $texto: '#333333',
    $texto80: 'rgba(51, 51, 51, 0.8)',
    $texto50: 'rgba(51, 51, 51, 0.5)',
    $texto20: 'rgba(51, 51, 51, 0.2)',
    $blanco: '#FFFFFF',
    $adicional: '#00A6E0',
    $adicional80: 'rgba(0, 166, 224, 0.8)',
    $adicional50: 'rgba(0, 166, 224, 0.5)',
    $adicional20: 'rgba(0, 166, 224, 0.2)',
    $disponible: '#4CAF50',
    $reservada: '#FFEB3B',
    $prestada: '#FF9800',
    $taller: '#f44336',
    $inactiva: 'black',
  }
}

export default colores;