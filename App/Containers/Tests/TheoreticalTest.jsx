import {
    Text,
    View,
    StyleSheet,
    Pressable,
    Image,
    ScrollView,
    Modal,
  } from 'react-native';
  import React, { useState, useEffect, useRef } from 'react';
  import { connect, useDispatch } from 'react-redux';
  import Colors from '../../Themes/Colors';
  import Fonts from '../../Themes/Fonts';
  import Images from '../../Themes/Images';
  import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
  import ProgressBar from '../RegisterExt/ProgressBar';
  import CheckBox from '@react-native-community/checkbox';
  import questionData from './Questions.json';
  import Video, {VideoRef} from 'react-native-video';
  import * as RootNavigation from '../../RootNavigation';
  import TestResult from './TestResult';
  import { Alert } from 'react-native';
  import { 
    send_answers,
    ask_theoretical,
    passed_theoretical
  } from '../../actions/actionCarpooling';
  import { v4 as uuidv4 } from 'uuid';
  //import VideoTest from './Bcguiavideo2024.mp4';

  function TheoreticalTest(props) {
    const dispatch = useDispatch();
    const [ selectedAnswers, setSelectedAnswers ] = useState(new Array(questionData.questions.length).fill(undefined));
    const [ correctAnswersCount, setCorrectAnswersCount ] = useState(0);
    const [ result, setResult ] = useState(false);
    const [ showConfirmModal, setShowConfirmModal ] = useState(false);
    const [ showVideo, setShowVideo ] = useState(true);
    const [ showTestModal, setShowTestModal ] = useState(false);
    const [ terms, setTerms ] = useState(false);

    const validateForm = () => {
      // Validar que todas las preguntas tengan respuestas y que los términos estén aceptados
      const allAnswered = questionData.questions.every((_, index) => selectedAnswers[index] !== undefined);
      return allAnswered && terms;
    };
    // const videoRef = useRef<VideoRef>(null);
    
    const totalQuestions = questionData.questions.length;
    
    const handleCheckBoxChange = (questionIndex, option) => {
      setSelectedAnswers(prevAnswers => {
        const newAnswers = { ...prevAnswers, [questionIndex]: option };
        const correctAnswers = questionData.questions.map((q, index) => q.correctAnswer);
        const newCorrectAnswersCount = Object.keys(newAnswers).filter(
          index => newAnswers[index] === correctAnswers[index]
        ).length;
        setCorrectAnswersCount(newCorrectAnswersCount);
        return newAnswers;
      });
    };
    const handleModalConfirm = () => {
      const dataToSend = {
        "_id": uuidv4(),
        "teorica_exitosas": correctAnswersCount,
        "teorica_fecha": new Date().toISOString(),
        "teorica_resultado": correctAnswersCount > 13 ? 'APROBO' : 'REPROBO',
    }
      dispatch(send_answers(dataToSend));
      dispatch(ask_theoretical());
      if( correctAnswersCount > 13 ){
        dispatch(passed_theoretical());
        setResult(true);
      }else{
        setResult(false);
      }
      setShowConfirmModal(false);
      setShowTestModal(true);
    };
    const handleModalCancel = () => {
      setShowConfirmModal(false);
    };
    const goBack = () => {
      RootNavigation.navigate("Home");
    }
    const sendNextPage = () => {
      if(correctAnswersCount > 13){
        setShowConfirmModal(false);
        setShowTestModal(false);
        RootNavigation.navigate("ScheduleTest");
      }else{
        setTerms(false);
        setCorrectAnswersCount(0);
        setSelectedAnswers({});
        setShowTestModal(false);
      }
    };

    const validateAnswers = () => {
      return questionData.questions.every((_, index) => selectedAnswers[index] !== undefined);
    };
    
    const handleSubmit = () => {
      if (!terms) {
        Alert.alert('Términos y condiciones', 'Debes aceptar términos y condiciones');
        return;
      }
      if (validateAnswers()) {
        setShowConfirmModal(true); 
      } else {
        Alert.alert('Error', 'Por favor, responde todas las preguntas.');
      }
    };

    const ConfirmationModal = ({ visible, onConfirm, onCancel }) => {
      return (
        <Modal
          transparent={true}
          animationType="slide"
          visible={visible}
          onRequestClose={onCancel}
        >
          <View style={estilos.modalOverlay}>
            <View style={estilos.modalContainer}>
              <Image source={Images.iconoalerta} style={{width: 60, height: 60, tintColor: Colors.$primario, marginVertical : 20 }}/>
              <Text style={estilos.modalTitle}>Confirmar envío</Text>
              <Text style={estilos.modalMessage}>¿Estás seguro de que deseas enviar todas las respuestas? Puedes revisar tus respuestas antes de enviarlas o volver a iniciar la prueba.</Text>
              <View style={[estilos.modalButtonsContainer]}>
                <Pressable 
                onPress={onCancel}
                style={[estilos.botonItem, {width : '45%', backgroundColor : Colors.$secundario}]}
                >
                  <Text style={ estilos.textBoton }>Revisar</Text>
                </Pressable>
                <Pressable 
                onPress={onConfirm}
                style={[estilos.botonItem, {width : '45%'}]}
                >
                  <Text style={ estilos.textBoton }>Enviar</Text>
                </Pressable>
              </View>
              <View style={estilos.lineDown}></View>
            </View>
          </View>
        </Modal>
      );
    };

     return (
      <View style={{flex : 1, backgroundColor : 'white'}}>
        {showConfirmModal && (
          <ConfirmationModal
            visible={showConfirmModal}
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
          />
        )}
        {showTestModal && (
          <TestResult
            visible={true}
            result={result}
            sendTo={sendNextPage}
          />
        )}
        <ScrollView>
        <View style={{flexDirection : 'row', justifyContent : 'flex-start', backgroundColor : 'white'}}>
          <View style={estilos.containerVideo}>
            <Video
              // ref={videoRef}
              source={{ uri: 'https://bicyclecapital.co/video/Bcguiavideo2024.mp4' }}
              style={estilos.backgroundVideo}
              controls={true}
              resizeMode="cover"
              bufferConfig={{
                minBufferMs: 15000,
                maxBufferMs: 30000,
                bufferForPlaybackMs: 2500,
                bufferForPlaybackAfterRebufferMs: 5000,
              }}
            />
          </View>
          <Pressable onPress={() => { goBack() }} style={{      
            position: 'absolute',
            top: 20, 
            left: 20,
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
            elevation: 5,
            zIndex : 5 }}>
            <Image style={{ width: horizontalScale(25), height: verticalScale(25), borderRadius: horizontalScale(30), }} source={Images.atras_Icon} />
          </Pressable>
        </View>
      <Text style={estilos.firstTitle}>Prueba teórica</Text>
      <Text style={estilos.firstParagraph}>Esta prueba está diseñada para garantizar que los usuarios cumplan con los requisitos de seguridad y efectividad.</Text>
        
      {questionData.questions.map((question, questionIndex) => {
        const currentQuestionNumber = questionIndex + 1;
        const progress = (currentQuestionNumber) / totalQuestions*100;
        return (
          <View key={questionIndex} style={estilos.questionContainer}>
            <View style={estilos.headerContainer}>
              <Text style={estilos.headerQuestions}>
                Pregunta {currentQuestionNumber} de {totalQuestions}
              </Text>
              <View style={estilos.progressBarContainer}>
                <ProgressBar progress={progress} />
              </View>
            </View>
            <View style={estilos.containerQuestion}>
              <Text style={estilos.textBox}>{question.question}</Text>
              {question.options.map((option, optionIndex) => (
                <View key={optionIndex} style={{ flexDirection: 'row', alignItems: 'center', marginVertical : 5, width : '80%' }}>
                  <CheckBox
                    value={selectedAnswers[questionIndex] === option}
                    onValueChange={() => handleCheckBoxChange(questionIndex, option)}
                    tintColors={{ true: Colors.$adicional , false: 'black' }}
                  />
                  <Text style={estilos.textBox}>{option}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
      <View style={{ flexDirection: 'row', marginLeft : '10%'}}>
        <CheckBox
          value={terms}
          onValueChange={() => setTerms(!terms)}
          tintColors={{ true: 'black', false: 'black' }}
        />
        <Text style={[{ fontFamily:Fonts.$poppinsregular, fontSize:13, color:'black',	textAlign:'justify', textAlignVertical : 'center'}]}>
          Aceptar términos y condiciones</Text>
      </View>
      <View style={{flexDirection : 'row', justifyContent : 'center' , marginVertical : 20}}> 
        <Pressable 
          onPress={() => {
            if (validateForm()) {
              setShowConfirmModal(true);
            } else {
              Alert.alert('Error', 'Por favor, completa todas las preguntas y acepta los términos y condiciones.');
            }
          }}
          style={validateForm() ? estilos.botonItem : estilos.changeBackground}
          >
          <Text style={ estilos.textBoton }>Enviar respuestas</Text>
        </Pressable>
      </View>
      </ScrollView>
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
      marginBottom : 15
    },
    headerQuestions: {
      color : 'black', 
      marginStart : '15%', 
      width : '65%',
      fontSize : moderateScale(14),
    },
    textBoton: {
      fontSize: moderateScale(20),
      color: Colors.$blanco,
      fontFamily: Fonts.$poppinsregular,
    },
    botonItem: {
      backgroundColor: Colors.$primario,
      width: "90%",
      alignItems: "center",
      justifyContent: "center",
      padding: 5,
      borderRadius: 30,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 16,
    },
    changeBackground:{
      backgroundColor: Colors.$secundario,
      width: "90%",
      alignItems: "center",
      justifyContent: "center",
      padding: 5,
      borderRadius: 30,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 16,
    },
    botonVideo: {
      backgroundColor: Colors.$primario,
      width: "90%",
      alignItems: "center",
      justifyContent: "center",
      padding: 5,
      borderRadius: 30,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 16,
      width : '45%', 
      position : 'absolute',
      bottom : 30
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
      alignItems: 'center',
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
    }
  })
  
  function mapStateToProps(state) {
  return {
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
  )(TheoreticalTest);