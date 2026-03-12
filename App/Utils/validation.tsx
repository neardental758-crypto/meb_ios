import I18n from './language.utils';

import { Alert } from 'react-native';
import moment from 'moment';
import { validate } from 'validate.js';

/*validate.extend(validate.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.

  parse: function (value: any, options: any) {
    let momentDate = moment(new Date());
    let formatedValue = +moment.utc(momentDate);
    return formatedValue;
  },
  // Input is a unix timestamp
  format: function (value: any, options: any) {
    var date = new Date(value);
    return date.toString();
  }
});*/

export const validateLogin = (form: any) => {
  console.log('form form form',form)
  var constraints = {
    email: {},
    password: {},
  }
  console.log('abajo de form en validation constraints,' , constraints)
  console.log('en validate.tsx que viene en el form', form)
  setPresence(constraints, "password", "contraseña");
  emailValidation(constraints);
  var validationResults = validate(form, constraints) || [];
  console.log('LOS RESULTADOS DE VALIDATE LOGIN :::: ', validationResults);
  printError(validationResults)
  return validationResults;
};

export const validateChangeEmail = (form: any) => {
  var constraints = {
    email: {},
    password: {
      length: {
        minimum: 8,
        message: "^(*) " + 'Contraseña demasiado corta.',
      },
      presence: { message: "^" + 'El campo de contraseña es requerido' },
      format: {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&"'?¿#/=¡+,;.:<>_])[A-Za-z\d@$!%*?&"'?¿#/=¡+,;.:<>_]{8,}$/,
        message: "^" + 'Minimo una mayúscula, una minúscula, un número y un caracter',
      }
    },
  }
  setPresence(constraints, "password", 'Password');
  emailValidation(constraints);
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
};

export const validateRegister = (form: any) => {
  const startTime = Date.now();
  var constraints = {
    name: {
      length: {
        maximum: 30,
        message: "^(*) Nombre supera 30 caracteres"
      }
    },
    idType: {
      presence: { message: "^El campo de tipo de documento es requerido" }
    },
    idNumber: {
      presence: { message: "^El campo de numero de documento es requerido" }
    },
    email: {
      presence: { message: "^El campo de correo electrónico es requerido" },
      email: true
    },
    password: {
      presence: { message: "^El campo de contraseña es requerido" },
      format: {
        pattern: /^[0-9]{4}$/,
        message: "^La contraseña debe ser de 4 digitos."
        /* pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&"'?¿#/=¡+,;.:<>_])[A-Za-z\d@$!%*?&"'?¿#/=¡+,;.:<>_]{8,}$/,
        message: "^la contraseña debe ser minimo de 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial." */
      }
    },
    confirmPassword: {
      presence: { message: "^El campo de confirmación de contraseña es requerido" },
      format: {
        pattern: /^[0-9]{4}$/,
        message: "^La contraseña debe ser de 4 digitos."
      }
    },
    // terms: {},
    // /*  termsCondition: {
    //    presence: { message: "^Aceptar terminos y condiciones es requerido" }
    //  }, */
  }

  /*
  if(form.compilationType == "ibague"){
    constraints = {
      ...constraints, 
      // gender: {},
      birth: {},
      residentType:{},
      profession:{},
      workStatus:{},
      civilState:{},
    }
    // setPresence(constraints, "gender", "genero");
    setPresence(constraints, "residentType", "tipo de residente");
    setPresence(constraints,"profession","profesion");
    setPresence(constraints,"workStatus","estado laboral");
    setPresence(constraints,"civilState","estado civil");
    setPresencebirthday(constraints, "birth", "minimo de edad");


  }else if(form.compilationType == "corporativo"){
  constraints = {
    ...constraints,
    companysType:{},
    transportationsMode:{},
  }
  setPresence(constraints,"companysType","tipo de empresa");
  setPresence(constraints,"transportationsMode","metodo de transporte");
  }
  */

  setPresence(constraints, "name", " nombres ");
  // setPresence(constraints, "phone", " teléfono ");
  // setPresence(constraints, "firstLastName", " primer apellido ");
  // setPresence(constraints, "secondLastname", " segundo apellido ");
  setPresence(constraints, "email", " correo electrónico ");
  // setPresence(constraints, "confirmEmail", " confirmación de correo electrónico ");
  setPresence(constraints, "idType", " tipo de documento ");
  setPresence(constraints, "idNumber", " número de documento ");
  setPresence(constraints, "password", " contraseña ");
  setPresence(constraints, "confirmPassword", " confirmación de contraseña ");
  // setPresence(constraints, "terms", " términos y condiciones ");
  // setPresence(constraints, "stateDocumentUser", " foto documento identidad ");
  //repeatEmailValidation(constraints, "confirmEmail", "email");  //se comenta tiene error
  repeatpasswordValidation(constraints);
  emailValidation(constraints);
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  const endTime = Date.now(); // Marca el tiempo final
	console.log(`validateRegister total execution time: ${endTime - startTime} ms`);
  //Alert.alert(`validateRegister total execution time: ${endTime - startTime} ms`);
  return validationResults;
};

export const validateCreateProfile = (form: any) => {
  var constraints = {
    name: {
      length: {
        maximum: 30,
        message: "^(*) Nombre supera 30 caracteres"
      },
    },
    username: {},
    description: {},
    birthday: {},
    gender: {},
    skills: {},
    achievement: {},
  }
  setPresence(constraints, "name", "nombre");
  //setPresence(constraints, "username", "usuario");
  setPresence(constraints, "description", "descripción");
  setPresence(constraints, "birthday", "fecha de nacimiento");
  setPresence(constraints, "gender", "género");
  setPresence(constraints, "skills", "habilidades");
  setPresence(constraints, "achievement", "logros");
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
}

export const validateConfiguration = (form: any) => {
  var constraints = {
    email: {
      email: {
        message: "^(*) " + 'Ingresa un email valido',
      }
    },
    password: {
      format: {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message: "^" + 'Minimo una mayúscula, una minúscula, un número y un caracter'
      }
    },
    language: {},
    notifications: {},
    units: {},
  }
  setPresence(constraints, "language", 'Idioma');
  setPresence(constraints, "notifications", 'Notificaciones');
  setPresence(constraints, "units", 'Unidades de medida');
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
}

export const validateDeviceConfiguration = (form: any) => {
  var constraints = {
    email: {},
    password: {
      format: {
        presence: { message: "^" + 'El campo de contraseña de verificacion es requerido' },
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message: "^" + 'Minimo una mayúscula, una minúscula, un número y un caracter'
      }
    },
    device: {},
  }
  setPresence(constraints, "device", 'Dispositivos');
  emailValidation(constraints);
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
}

export const validateCreateEvent = (form: any) => {
  form.hour = form.time;
  form.startDate = new Date(form.timeto);
  form.endDate = new Date(form.timefrom);
  var constraints = {
    name: {},
    description: {},
    hour: {},
    route: {},
    conditions: {},
    rules: {},
    award: {},
    image: {
      presence: {
        message: '^(*)' + 'Debes subir una imagen',
      },
    },
    startDate: {
      presence: {
        message: '^(*)' + 'La fecha de inicio es requerida',
      },
      datetime: {
        // dateOnly: true,
        earliest: new Date(),
        message: '^(*)' + 'La fecha de inicio no puede ser del pasado.',
      }
    },
    endDate: {
      presence: {
        message: '^(*)' + 'La fecha final es requerida.',
      },
      datetime: {
        // dateOnly: true,
        earliest: new Date(form.startDate),
        message: '^(*)' + 'La fecha de final no puede ser una fecha anterior a la fecha de inicio.',
      }
    },
  }
  setPresence(constraints, "name", 'Nombre');
  setPresence(constraints, "description", 'Descripción');
  setPresence(constraints, "hour", 'Hora');
  setPresence(constraints, "route", "recorrido");
  setPresence(constraints, "conditions", 'Condiciones generales');
  setPresence(constraints, "rules", 'Reglamentaciones');
  setPresence(constraints, "award", 'Premio');
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
}

export const validateUserEventSubscription = (form: any) => {
  var constraints = {
    name: {},
    email: {},
    phone: {},
  }
  setPresence(constraints, "name", 'Nombre');
  emailValidation(constraints);
  phoneValidation(constraints);
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
}

export const validateCreateAward = (form: any) => {
  var constraints = {
    title: {},
    description: {},
    image: {},
  }
  setPresence(constraints, "title", 'Titulo');
  setPresence(constraints, "description", 'Descripción');
  setPresence(constraints, "image", 'Imagen');
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
}

export const validateCard = (form: any) => {
  var constraints = {
    nTarget: {},
    nameTarget: {},
    document: {},
    month: {},
    year: {}
  }
  setPresence(constraints, "nTarget", 'Numero de tarjeta');
  setPresence(constraints, "nameTarget", 'Nombre de tarjeta');
  setPresence(constraints, "document", 'Documento de identidad');
  setPresence(constraints, "month", 'Mes de vencimiento');
  setPresence(constraints, "year", 'Año de vencimientor');
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
}

export const validateCreateClub = (form: any) => {
  var constraints = {
    name: {},
    description: {},
    admins: {},
    members: {},
  }
  setPresence(constraints, "name", 'Nombre');
  setPresence(constraints, "description", 'Descripción');
  setPresence(constraints, "admins", 'Administradores');
  setPresence(constraints, "members", 'Miembros');
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
}

export const validateSupport = (form: any) => {
  var constraints = {
    message: {},
    email: {},
  }
  setPresence(constraints, "message", 'Mensaje');
  emailValidation(constraints);
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
}

export const validateSync = (form: any) => {
  var constraints = {
    traffic: {},
    dangerousDescent: {},
    roadCondition: {},
    bikeway: {},
    accessibility: {},
    funFactor: {},
  }
  setPresence(constraints, "traffic", 'Tráfico');
  setPresence(constraints, "dangerousDescent", 'Descenso peligroso');
  setPresence(constraints, "roadCondition", 'Buen estado de la carretera');
  setPresence(constraints, "bikeway", 'Bici carril');
  setPresence(constraints, "accessibility", 'Accesibilidad');
  setPresence(constraints, "funFactor", 'Fun factor');
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
}

export const validateForgotPassword = (form: any) => {
  var constraints = {
    email: {},
  }
  emailValidation(constraints);
  var validationResults = validate(form, constraints) || [];
  printError(validationResults)
  return validationResults;
}




function setPresence(constraints: any, key: string, name: string) {
  constraints[key].presence = { message: "^(*) " + 'El campo de' + name + 'es requerido', allowEmpty: false };
}

function setPresencebirthday(constraints: any, key: string, name: string) {
  constraints[key].presence = { message: "^(*)debes tener almenos 16 años ", allowEmpty: false };
}


/* function birthdayValidation(constraints: any) {
 
  constraints.birthday = {
    datetime: {
      latest: moment.utc().subtract(16, 'years'),
      message: "^Debes tener al menos 16 años."
    }
  }
  return constraints
} */

function emailValidation(constraints: any) {
  constraints.email = {
    presence: { message: "^(*) " + 'El campo de email es requerido' },
    email: {
      message: "^(*) " + 'Ingresa un email valido',
    }
  }
  return constraints
}
function repeatEmailValidation(constraints: any) {
  constraints.confirmEmail = {
    equality: {
      attribute: "email",
      message: "^Correos electronicos no concuerdan",
    }
  };
  return constraints
}




function repeatpasswordValidation(constraints: any) {
  constraints.password = {
    presence: { message: "^El campo de contraseña es requerido" },
    equality: {
      attribute: "confirmPassword",
      message: "^Las contraseñas no coinciden"
    }
  };

  constraints.confirmPassword = {
    presence: { message: "^El campo de confirmación de contraseña es requerido" }
  };

  return constraints;
}


/* function confirmTermsCondition(constraints: any) {
  constraints.termsCodition = {
    presence: { message: "^aceptar terminos y condiciones es requerido" },
    equality: {
      comparator: function()
    }
  };
  return constraints
} */

function phoneValidation(constraints: any) {
  constraints.phone = {
    presence: { message: "^" + 'El campo de número de telefono es requerido' },
    length: { is: 10, message: "^" + 'El número de telefono no es válido' },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: "^" + 'El número de telefono no es valido',
    }
  };
  return constraints
}

function printError(obj: any) {
  var valtoPrint = "";
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      valtoPrint = valtoPrint.concat(JSON.stringify((obj[p][0])).slice(1, -1))
      valtoPrint = valtoPrint.concat("\n")
    }
  }
  if (valtoPrint.length != 0) {
    setTimeout(function(){ Alert.alert('Verifica', valtoPrint); }, 100)
  }
}