import React,{ useState } from 'react';
import {
    Image, View, ImageBackground, Text, TouchableOpacity
} from 'react-native';
import styles from './Styles/TutorialScreen.style';
import { connect } from 'react-redux';
import AppIntroSlider from 'react-native-app-intro-slider';
import Images from '../../Themes/Images';

const slides = [
    {
        key: 'one',
        title: 'Bienvenido a Bicycle_App',
        text: <Text style={styles.tutorialSub}><Text>Diseñadas en circuitos locales. Gana grandes premios y acumula puntos para ser el </Text> <Text style={styles.bold}>capo de la temporada</Text></Text>,
        
    },
    {
        key: 'two',
        title: '',
        text: <Text style={styles.tutorialSub}><Text>bate tus propias marcas, escala más, ve más lejos, </Text> <Text style={styles.bold}>se más rápido.</Text></Text>,
        image: Images.tutorial2,
    },
];
function TutorialScreen (props) {
    const [ state, setState ] = useState({
        currentSlide: 0,
    });
    const goLoggin = () => {
        props.navigation.navigate('LoginScreen');
    }
    const onSlideChange = (index) => {
        setState({ ...state, currentSlide: index });
    }
    const renderNextButton = () => {
        return (
            <View style={styles.skipButtons}>
                <TouchableOpacity onPress={() => goLoggin()}>
                    <Text style={styles.skipButton}>OMITIR</Text>
                </TouchableOpacity>
            </View>
        );
    };
    const renderSkipButton = () => {
        return (
            <View style={styles.skipButtons}>
                <TouchableOpacity onPress={() => goLoggin()}>
                    <Text style={styles.skipButton}>INICIAR</Text>
                </TouchableOpacity>
            </View>
        );
    };
    const renderItem = (item) => {
        return (
            <View>
                <View style={{}}>
                    <Image style={[{height: item.item.key == 'two' ? item.item.imageStyle : '100%'},styles.tutorialPerson]} source={item.item.image} />
                </View>
                <View style={[{marginTop: item.item.key == 'two' ? '7%' : 0},styles.tutorialTexts]}>
                    <Text style={styles.tutorialTitle}>{item.item.title}</Text>
                    <Text style={styles.tutorialSub}>{item.item.text}</Text>
                </View>
            </View>
        );
    }
        return (
            <ImageBackground source={Images.tutorialBg} style={styles.tutorialBackground}>
                <AppIntroSlider
                    renderItem={renderItem}
                    slides={slides}
                    onSlideChange={onSlideChange}
                    paginationStyle={styles.paginationStyle}
                    dotStyle={[styles.dotStyle]}
                    activeDotStyle={styles.activeDotStyle}
                    renderNextButton={renderNextButton}
                    renderDoneButton={renderSkipButton}
                />
            </ImageBackground>
        );
    }

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer
    }
}
export default connect(
    mapStateToProps,
)(TutorialScreen);
