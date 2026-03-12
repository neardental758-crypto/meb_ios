import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import { Alert } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import * as RootNavigation from '../../RootNavigation';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { 
  bringAvailableAppointments,
  send_schedule,
  cancel_schedule,
  ask_practice
} from '../../actions/actionCarpooling';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar', 'Abr', 'May', 'Jun', 'Jul.', 'Ago', 'Sept.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mier.', 'Jue.', 'Vier.', 'Sáb.'],
  today: "Hoy"
};
LocaleConfig.defaultLocale = 'es';

function ScheduleTest(props) {
  const dispatch = useDispatch();

  const [ canSchedule, setCanSchedule ] = useState(false);
  useEffect(() => {
    if(Object.keys(props.activeSchedule).length === 0){
      setCanSchedule(true);
    }else{
      setCanSchedule(false);
    }
  },[props.activeSchedule])

  const [ showModalSchedule, setShowModalSchedule ] = useState(false);
  const [ selectedDate, setSelectedDate ] = useState(null);
  const [ activePracticeDates , setActivePracticeDates ] = useState([]);
  const [ hoursForSelectedDate, setHoursForSelectedDate ] = useState([]);
  const [ selectedHour, setSelectedHour ] = useState(null);
  const [ selectedTimeData, setSelectedTimeData ] = useState({ date: null , time: null , id: null , station: null, address: null, descripcion: null, idSchedule: null });
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    if (props.activeSchedule.length > 0) {
      const date = moment(props.activeSchedule[0].agendado_fecha);
      const dateString = date.format('YYYY-MM-DD');
      const timeString = date.format('HH:mm');
      setSelectedTimeData({
        date: dateString,
        time: timeString,
        id: props.activeSchedule[0].agendado_practica,
        station: props.activeSchedule[0].agendado_estacion,
        idSchedule: props.activeSchedule[0]._id,
        address: props.activeSchedule[0].Practica.Estacion.est_direccion,
        description: props.activeSchedule[0].Practica.Estacion.est_descripcion
      });
    }
  }, [props.activeSchedule]);

  const today = moment().format('YYYY-MM-DD');

  const goBack = () => {
    RootNavigation.navigate("Home");
  }
  
  const handleHourPress = useCallback((timeData) => {
    setSelectedTimeData({ 
      date: selectedDate, 
      time: timeData.time, 
      id: timeData.id, 
      station: timeData.station, 
      description: timeData.descripcion, 
      address: timeData.direccion 
    });
    setSelectedHour(timeData.time);
  }, [selectedDate]);

  const mapPracticesToDates = (practices) => {
    const groupedDates = {};
    if (!Array.isArray(practices)) {
      return groupedDates;
    }
    practices.forEach(practice => {
      if (practice.practica_fecha && practice._id && practice.practica_estacion) {
        // Usar moment.utc() para mantener la hora exacta de la BD sin conversión de zona horaria
        const dateTime = moment.utc(practice.practica_fecha);
        if (dateTime.isValid()) {
          const date = dateTime.format('YYYY-MM-DD');
          const time = dateTime.format('HH:mm');
          if (!groupedDates[date]) {
            groupedDates[date] = [];
          }
          groupedDates[date].push({ time, id: practice._id, station : practice.practica_estacion, direccion : practice.Estacion.est_direccion, descripcion : practice.Estacion.est_descripcion });
        } else {
          console.warn('Invalid date:', practice.practica_fecha);
        }
      } else {
        console.warn('Missing practica_fecha or id in practice:', practice);
      }
    });
    return groupedDates;
  };
  const groupedDates = mapPracticesToDates(props.practices || []);

  useEffect(() => {
    dispatch(bringAvailableAppointments());
  },[])

 const addActivePractices = useCallback(() => {
  const practices = props.practices || [];
  if (Array.isArray(practices)) {
    const practiceDates = practices.map(practice => {
      return moment(practice.practica_fecha).format('YYYY-MM-DD');
    });
    const markedDates = practiceDates.reduce((acc, date) => {
      acc[date] = { selected: true, selectedColor: Colors.$secundario };
      return acc;
    }, {});
    if (selectedDate) {
      markedDates[selectedDate] = { 
        marked: true, 
        selected: true, 
        selectedColor: Colors.$primario 
      };
    }
    setActivePracticeDates(markedDates);    
  }
}, [props.practices, selectedDate]);


  // Función que se llama cuando el modal confirma la selección
  const handleModalConfirm = useCallback((date) => {
    console.log('valor de date ' + date)
    setSelectedDate(date);
    setShowModalSchedule(false); // Cierra el modal
  }, []);

  // Función que se llama cuando se cancela el modal
  const handleModalCancel = useCallback(() => {
    setShowModalSchedule(false);
  }, []);

  useEffect(() => {
    addActivePractices();
  }, [props.practices]);


const ScheduleModal = ({ visible, onConfirm, onCancel }) => {
  const [ isSchedule, setIsSchedule ] = useState(true);
  const handleDayPress = useCallback((day) => {
    const newSelectedDate = day.dateString;
    
    // Actualizar el mes actual para mantener la navegación
    setCurrentMonth(newSelectedDate);
    
    // Actualizar activePracticeDates inmediatamente sin re-render completo
    const practices = props.practices || [];
    const practiceDates = practices.map(practice => {
      return moment(practice.practica_fecha).format('YYYY-MM-DD');
    });
    
    const markedDates = practiceDates.reduce((acc, date) => {
      acc[date] = { selected: true, selectedColor: Colors.$secundario };
      return acc;
    }, {});
    
    // Marcar la nueva fecha seleccionada
    markedDates[newSelectedDate] = { 
      marked: true, 
      selected: true, 
      selectedColor: Colors.$primario 
    };
    
    setActivePracticeDates(markedDates);
    setSelectedDate(newSelectedDate);
    
    // Procesar horarios disponibles - SIN ajustar horas
    const timesWithIds = groupedDates[newSelectedDate] || [];
    const adjustedTimes = timesWithIds.map((item) => {
      // Usar directamente el time sin ajustes de zona horaria
      return {
        ...item,
        time: item.time,
      };
    });
    
    setHoursForSelectedDate(adjustedTimes);
    setSelectedHour(null);
  }, [groupedDates, props.practices]);

  const handleConfirm = useCallback(() => {
    if (selectedTimeData.date && selectedTimeData.time && selectedTimeData.id && selectedTimeData.station) {
      setIsSchedule(false);
    }
  }, [selectedTimeData, onConfirm]);

  const closeModal = () => {
    if(!isSchedule){
      setIsSchedule(true);
    }else{
      onCancel();
    }
  };
  const sendSchedule = () => {
    const newIdToSendSchedule = uuidv4();
    const dataToSend = {
      "_id": newIdToSendSchedule,
      "agendado_practica": selectedTimeData.id,
      "agendado_estacion": selectedTimeData.station,
      "agendado_fecha": `${selectedTimeData.date}T${selectedTimeData.time}`,
      "agendado_estado": 'ACTIVA',
      "quitar_cupo" : selectedTimeData.id
    }
    dispatch(send_schedule(dataToSend));
    setSelectedTimeData({...selectedTimeData, idSchedule : newIdToSendSchedule})
    dispatch(ask_practice());
    onCancel();
    setCanSchedule(false);
  };

  const renderCustomHeader = (date) => {
    // Usar la fecha seleccionada o la fecha actual del calendario si no hay selección
    const dateToShow = selectedDate || date.dateString || today;
    
    // Usar moment para parsear la fecha correctamente
    const currentDate = moment(dateToShow);
    
    // Obtener los nombres desde tu LocaleConfig
    const monthNames = LocaleConfig.locales['es'].monthNames;
    const dayNames = LocaleConfig.locales['es'].dayNames;
    
    // Formatear la fecha usando moment
    const dayName = dayNames[currentDate.day()];
    const dayNumber = currentDate.date();
    const monthName = monthNames[currentDate.month()];
    const year = currentDate.year();
    
    return (
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: 'white'
      }}>
        <Text style={{ 
          fontSize: moderateScale(16), 
          color: 'black',
          fontWeight: '400'
        }}>
          {`${dayName}, ${dayNumber} de ${monthName} del ${year}`}
        </Text>
      </View>
    );
  };

  return (
 <Modal
  transparent={true}
  visible={visible}
  
 >

  <View style={estilos.modalOverlay}>
   <View style={estilos.modalContainer}>
      <View style={{flexDirection : 'row', justifyContent : 'flex-start', padding: 20, backgroundColor : 'white'}}>
          <Pressable onPress={closeModal} style={{    
              backgroundColor : 'white',
              justifyContent: 'center',
              alignItems: 'center',
              width: horizontalScale(40),
              height: verticalScale(40),
              borderRadius: moderateScale(40),
              borderColor: 'black',
              overflow: 'hidden',
              shadowColor: 'black', 
              shadowOffset: { width: horizontalScale(40), height: verticalScale(40), }, 
              shadowOpacity: 1, 
              shadowRadius: moderateScale(60), 
              elevation: 5, }}>
              <Image style={{ width: horizontalScale(25), height: verticalScale(25), borderRadius: horizontalScale(30) }} source={Images.atras_Icon} />
          </Pressable>
    </View>
    
    {isSchedule &&
    <View>
    <Calendar
      style={estilos.calendar}
      current={currentMonth}
      onDayPress={handleDayPress}
      markedDates={activePracticeDates}
      renderHeader={renderCustomHeader}
      onMonthChange={(month) => {
        setCurrentMonth(month.dateString);
      }}
      theme={{
        arrowColor: Colors.$primario,
        monthTextColor: 'black',
        dayTextColor: 'black',
        textMonthFontSize: moderateScale(20), 
        textDayHeaderFontSize: moderateScale(13), 
      }}
    />
      <View style={{ flexDirection : 'column', alignItems : 'center' }}>
          <Text style={[estilos.firstParagraph,{ marginVertical : 10 }]}>Horario</Text>
          <View style={{ flexDirection : 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {hoursForSelectedDate.length > 0 ? (
            hoursForSelectedDate.map((timeData, index) => (
              <Pressable
                key={index}
                style={[estilos.botonItemHour, selectedHour === timeData.time && estilos.selectedHour]}
                onPress={() => handleHourPress(timeData)}
              >
                <Text style={[estilos.textBotonHour, selectedHour === timeData.time && estilos.selectedHourText]}>
                  {timeData.time}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={{ fontSize: moderateScale(16), marginBottom: 20 }}>No hay horarios disponibles para esta fecha.</Text>
          )}
          </View>
          <Pressable 
                  onPress={handleConfirm}
                  style={[estilos.botonItemDate, { padding : 5, width : '80%' }]}
                  >
                  <Text style={[estilos.textBoton, { fontSize: moderateScale(18) }]}>Seleccionar</Text>
          </Pressable>
          </View>
        </View>
    }
    {!isSchedule &&
    <View style={{flexDirection : 'column', alignItems : 'center'}}>
      <Image source={Images.iconoalerta} style={{width: 60, height: 60, tintColor: Colors.$primario, marginBottom : 20 }}/>
      <Text style={[estilos.textBoton, { fontSize: moderateScale(20), color : 'black', fontWeight : 'bold'  }]}>Detalles de cita</Text>
      <View style={{ width : '90%', borderWidth : 1, padding : 10, margin : 10, borderRadius : 10 }}>
        <Text style={[estilos.textBoton, { fontSize: moderateScale(19), color : 'black', fontWeight : 'bold'}]}>Prueba práctica</Text>
        <View style={{ borderWidth : 1, borderColor : 'black', borderRadius : 50, marginVertical : 5 }}></View>
        <Text style={[estilos.textBoton, { fontSize: moderateScale(17), color : 'black' }]}>Estación : {selectedTimeData.station || ''}</Text>
        <Text style={[estilos.textBoton, { fontSize: moderateScale(17), color : 'black' }]}>Dirección : {selectedTimeData.address || ''}</Text>
        { selectedTimeData.description === 'Sin descripción' ? null : <Text style={[estilos.textBoton, { fontSize: moderateScale(17), color : 'black' }]}>Descripción : {selectedTimeData.description || ''}</Text> }
        <Text style={[estilos.textBoton, { fontSize: moderateScale(17), color : 'black', marginHorizontal : 5 }]}>Fecha : {selectedTimeData.date || ''}</Text>
        <Text style={[estilos.textBoton, { fontSize: moderateScale(17), color : 'black', marginHorizontal : 5 }]}>Hora : {selectedTimeData.time || ''}</Text>
      </View>
      <View style={{ flexDirection : 'row', justifyContent : 'center' }}>
            <Pressable 
              onPress={sendSchedule}
              style={[estilos.botonItemDate, { padding : 5, width : '80%' }]}
            >
            <Text style={[estilos.textBoton, { fontSize: moderateScale(18) }]}>Agendar</Text>
          </Pressable>
      </View>
    </View>
    }
    </View>
  </View>
 </Modal>
      );
    };

   return (
    <View style={{ backgroundColor : 'white', flex : 1 }}>
      {showModalSchedule && (
      <ScheduleModal
          visible={showModalSchedule}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
      />
      )}
       <View style={{flexDirection : 'row', justifyContent : 'flex-start', padding: 20, backgroundColor : 'white'}}>
          <Pressable onPress={() => { goBack() }} style={{    
          backgroundColor : 'white',
          justifyContent: 'center',
          alignItems: 'center',
          width: horizontalScale(40),
          height: verticalScale(40),
          borderRadius: moderateScale(40),
          borderColor: 'black',
          overflow: 'hidden',
          shadowColor: 'black', 
          shadowOffset: { width: horizontalScale(40), height: verticalScale(40), }, 
          shadowOpacity: 1, 
          shadowRadius: moderateScale(60), 
          elevation: 5, }}>
          <Image style={{ width: horizontalScale(25), height: verticalScale(25), borderRadius: horizontalScale(30), }} source={Images.atras_Icon} />
      </Pressable>
      </View>
      <Text style={estilos.firstTitle}>Agenda tu test drive</Text>
      <Text style={estilos.firstParagraph}>Selecciona la fecha y hora que mas te convenga. Asiste a la cita y validaremos tu capacidad de manejo. Te podemos capacitar y dar acompañamiento personalizado si así lo deseas. </Text> 
      <View style={estilos.sectionForm}>
          <View style={{ flexDirection : 'column', alignItems : 'center'}}>
            <Image source={Images.calendarRed} style={{ width: 80, height: 80, tintColor : Colors.$primario, display : canSchedule ? 'flex' : 'none' }} />
            <Text style={estilos.subText}>{canSchedule ? '¿Por qué no lo haces ahora?' : `Fecha/hora: ${selectedTimeData.date} ${selectedTimeData.time}`}</Text>
            <Text style={estilos.subText}>{canSchedule ? '¡No has agendado una cita!' : `Estación: ${selectedTimeData.station}`}</Text>
            {canSchedule ? null : <Text style={estilos.subText}>Dirección : {selectedTimeData.address}</Text> }
            {canSchedule ? null : <Text style={estilos.subText}>{selectedTimeData.description === 'Sin descripción' ? `` : `Descripción: ${selectedTimeData.description}`}</Text> }
          </View>
          <View style={{ flexDirection : 'column', alignItems : 'center', marginVertical : 15 }}>
            <Pressable 
                onPress={() => { 
                  dispatch(cancel_schedule(selectedTimeData));
                }}
              >
              <Image style={{ width: horizontalScale(40), height: verticalScale(40), tintColor : Colors.$primario, display : canSchedule ? 'none' : 'flex' }} source={Images.d_icon} />
            </Pressable>
          </View>
      </View>
      <View style={{ flexDirection : 'column', alignItems : 'center'}}>
        <Pressable 
          onPress={() => {
            if(canSchedule) {
              // Inicializar estados antes de abrir el modal
              setCurrentMonth(today);
              setSelectedDate(null);
              setSelectedHour(null);
              setHoursForSelectedDate([]);
              
              // Configurar fechas marcadas iniciales
              const practices = props.practices || [];
              if (Array.isArray(practices)) {
                const practiceDates = practices.map(practice => {
                  return moment(practice.practica_fecha).format('YYYY-MM-DD');
                });
                const markedDates = practiceDates.reduce((acc, date) => {
                  acc[date] = { selected: true, selectedColor: Colors.$secundario };
                  return acc;
                }, {});
                setActivePracticeDates(markedDates);
              }
              
              setShowModalSchedule(true);
            } else {
              Alert.alert('Agendar práctica', 'Ya tienes una práctica agendada');
            }
          }}
          style={[estilos.botonItemDate, { padding: 5, width: '40%', backgroundColor: Colors.$primario, display: canSchedule ? 'flex' : 'none' }]}
        >
          <Text style={[estilos.textBoton, { fontSize: moderateScale(18) }]}>Agendar</Text>
        </Pressable>
      </View>
      </View>
  );
}
const estilos = StyleSheet.create({
  overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 10,
        zIndex: 5,
    },
  modalsContainer: {
        backgroundColor: Colors.$blanco,
        borderRadius: 10,
        padding: 20,
        paddingTop: moderateScale(45),
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
  labelInput_2: {
    color: Colors.$texto,
    backgroundColor: Colors.$primario,
    width: 200
  },
  firstTitle: {
    marginStart : '10%',
    fontSize : moderateScale(25),
    marginVertical : 15
  },
  firstParagraph: {
    marginStart : '10%',
    width : '80%',
    fontSize : moderateScale(18),
    marginBottom : 15,
    textAlign : 'justify'
  },
  boxSchedule: {
    fontSize : moderateScale(20),
    marginVertical : 15,
    textAlign : 'center'
  },
  subText: {
    width : '80%',
    fontSize : moderateScale(18),
    textAlign : 'center',
    paddingVertical : 5
  },
  headerQuestions: {
    color : 'black', 
    marginStart : '15%', 
    width : '65%',
    fontSize : moderateScale(14),
  },
  textBoton: {
    fontSize: moderateScale(15),
    color: Colors.$blanco,
    fontFamily: Fonts.$poppinsregular,
  },
  textBotonHour: {
    fontSize: moderateScale(15),
    color: Colors.$primario,
    fontFamily: Fonts.$poppinsregular,
  },
  selectedHourText : {
    color : 'white'
  },
  botonItem: {
    backgroundColor: Colors.$primario,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 16,
    marginVertical : 10
  },
  botonItemDate: {
      backgroundColor : Colors.$primario,
      width: "70%",
      alignItems: "center",
      justifyContent: "center",
      padding: 3,
      borderRadius: 30,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 16,
      marginVertical : 10
    },
  botonItemHour: {
      backgroundColor: 'white',
      width: "30%",
      alignItems: "center",
      justifyContent: "center",
      padding: 3,
      borderRadius: 30,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 16,
      marginVertical : 10
  },
  selectedHour : {
    backgroundColor: Colors.$primario,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginBottom: moderateScale(10),
  },
  phoneInput: {
    width : '80%',
    fontFamily: Fonts.$poppinsregular,
    fontSize: moderateScale(16),
    paddingLeft : 15,
    paddingVertical: 5
  },
  countryPickerContainer : {
    flexDirection : 'row',
    justifyContent : 'center',
    alignItems : 'center',
    width : '85%',
    borderWidth: .8,
    borderRadius: 12,
  },
  innerContainer : {
    width : '100%',
    marginBottom : 5
  },
  containerQuestion : {
    padding: 30,
    marginHorizontal: 30,
    marginBottom: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 16,
    overflow: 'hidden',
  },
  textBox : {
    fontSize: moderateScale(14),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  modalTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    width : '65%',
    fontSize: moderateScale(16),
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  lineDown : {
    backgroundColor : Colors.$primario,
    borderColor : Colors.$primario,
    borderWidth : 4,
    borderRadius : 10,
    width : '90%',
    marginVertical : 20
  },
  containerVideo: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
  },
  correctAnswersText : {
    marginVertical : 30
  },

  container: {
      flex: 1,
  },
  calendar: {
      width : '100%',
      borderColor: 'gray',
  },
  agenda: {
      flex: 1,
  },
  item: {
      backgroundColor: 'lightblue',
      padding: 10,
      marginRight: 10,
      marginTop: 17,
      borderRadius: 5,
  },
  emptyDate: {
      height: 15,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
    sectionForm: {
      borderWidth : 1,
      borderColor : 'black',
      margin : 30,
      paddingVertical : 20,
      borderRadius : 15
    }
})

function mapStateToProps(state) {
  return {
    practices : state.reducerCarpooling.activePractices,
    activeSchedule : state.reducerCarpooling.activeSchedule || [],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    routing: (component) => dispatch(routing(component))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScheduleTest);