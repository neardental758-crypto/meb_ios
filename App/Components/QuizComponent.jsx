import React, { useState } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { ButtonComponent } from './ButtonComponent';
import { sycnAction, postUserTrackings } from '../actions/actions';
import { connect } from 'react-redux';
import Images from '../Themes/Images';
import Colors from '../Themes/Colors';
import Fonts from '../Themes/Fonts';
import I18n from '../Utils/language.utils';

function QuizComponent(props){
  
  const [trafficState, settrafficState] = useState({ traffic: false });
  const [dangerousDescentState, setdangerousDescentState] = useState({ dangerousDescent: false });
  const [roadConditionState, setroadConditionState] = useState({ roadCondition: false });
  const [bikewayState, setbikewayState] = useState({ bikeway: false });
  const [accessibilityState, setaccessibilityState] = useState({ accessibility: false });
  const [funFactorState, setState] = useState({ funFactor: false});

   const sendSync = () => {
    const userTrackingSurvey = { ...props.dataUser.userTrackings[1], ...state }
    props.postUserTrackings(props.dataUser.userTrackings[0], userTrackingSurvey);
  }

  const selectSurvery = (concept, val) => {
    if (concept == "traffic") {
      settrafficState({ traffic: val });
    } else if (concept == "dangerousDescent") {
      setdangerousDescentState({ dangerousDescent: val});
    } else if (concept == "roadCondition") {
      setroadConditionState({ roadCondition: val });
    } else if (concept == "bikeway") {
      setbikewayState({ bikeway: val });
    } else if (concept == "accessibility") {
      setaccessibilityState({ accessibility: val });
    } else if (concept == "funFactor") {
      setState({ funFactor: val });
    }
  }
    return (
      <View style={{ flex: 1, flexDirection: 'column', marginVertical: 20 }}>
        {
          //ROW
        }
        <View style={{ flex: 1, marginVertical: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.$linesGray, borderBottomWidth: 1, paddingBottom: 10 }}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Image source={Images.quiz01} style={{ flex: 0.3, padding: 10, resizeMode: "contain", height: 23, width: 23 }} />
                <Text style={{ flex: 1, fontSize: 12, fontFamily: Fonts.$poppinsregular }}>{I18n('Traffic')}</Text>
              </View>
              <TouchableOpacity onPress={() => selectSurvery("traffic", true)} style={{ flex: 0.5 }}><Text style={[trafficState.traffic ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>SI</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => selectSurvery("traffic", false)} style={{ flex: 0.5 }}><Text style={[!trafficState.traffic ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>NO</Text></TouchableOpacity>
            </View>
          </View>
        </View>
        {
          //endrow
        }
        {
          //ROW
        }
        <View style={{ flex: 1, marginVertical: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.$linesGray, borderBottomWidth: 1, paddingBottom: 10 }}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Image source={Images.quiz02} style={{ flex: 0.3, padding: 10, resizeMode: "contain", height: 23, width: 23 }} />
                <Text style={{ flex: 1, fontSize: 12, fontFamily: Fonts.$poppinsregular }}>{I18n('Dangerous_Descent')}</Text>
              </View>
              <TouchableOpacity onPress={() => selectSurvery("dangerousDescent", true)} style={{ flex: 0.5 }}><Text style={[dangerousDescentState.dangerousDescent ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>SI</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => selectSurvery("dangerousDescent", false)} style={{ flex: 0.5 }}><Text style={[!dangerousDescentState.dangerousDescent ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>NO</Text></TouchableOpacity>
            </View>
          </View>
        </View>
        {
          //endrow
        }
        {
          //ROW
        }
        <View style={{ flex: 1, marginVertical: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.$linesGray, borderBottomWidth: 1, paddingBottom: 10 }}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Image source={Images.quiz03} style={{ flex: 0.3, padding: 10, resizeMode: "contain", height: 23, width: 23 }} />
                <Text style={{ flex: 1, fontSize: 12, fontFamily: Fonts.$poppinsregular }}>{I18n('Road_Condition')}</Text>
              </View>
              <TouchableOpacity onPress={() => selectSurvery("roadCondition", true)} style={{ flex: 0.5 }}><Text style={[roadConditionState.roadCondition ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>SI</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => selectSurvery("roadCondition", false)} style={{ flex: 0.5 }}><Text style={[!roadConditionState.roadCondition ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>NO</Text></TouchableOpacity>
            </View>
          </View>
        </View>
        {
          //endrow
        }
        {
          //ROW
        }
        <View style={{ flex: 1, marginVertical: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.$linesGray, borderBottomWidth: 1, paddingBottom: 10 }}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Image source={Images.quiz04} style={{ flex: 0.3, padding: 10, resizeMode: "contain", height: 23, width: 23 }} />
                <Text style={{ flex: 1, fontSize: 12, fontFamily: Fonts.$poppinsregular }}>{I18n('Bikeway')}</Text>
              </View>
              <TouchableOpacity onPress={() => selectSurvery("bikeway", true)} style={{ flex: 0.5 }}><Text style={[bikewayState.bikeway ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>SI</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => selectSurvery("bikeway", false)} style={{ flex: 0.5 }}><Text style={[!bikewayState.bikeway ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>NO</Text></TouchableOpacity>
            </View>
          </View>
        </View>
        {
          //endrow
        }
        {
          //ROW
        }
        <View style={{ flex: 1, marginVertical: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.$linesGray, borderBottomWidth: 1, paddingBottom: 10 }}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Image source={Images.quiz05} style={{ flex: 0.3, padding: 10, resizeMode: "contain", height: 23, width: 23 }} />
                <Text style={{ flex: 1, fontSize: 12, fontFamily: Fonts.$poppinsregular }}>{I18n('Accesibility')}</Text>
              </View>
              <TouchableOpacity onPress={() => selectSurvery("accessibility", true)} style={{ flex: 0.5 }}><Text style={[accessibilityState.accessibility ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>SI</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => selectSurvery("accessibility", false)} style={{ flex: 0.5 }}><Text style={[!accessibilityState.accessibility ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>NO</Text></TouchableOpacity>
            </View>
          </View>
        </View>
        {
          //endrow
        }
        {
          //ROW
        }
        <View style={{ flex: 1, marginVertical: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1, flexDirection: "row", paddingBottom: 10 }}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Image source={Images.quiz06} style={{ flex: 0.3, padding: 10, resizeMode: "contain", height: 23, width: 23 }} />
                <Text style={{ flex: 1, fontSize: 12, fontFamily: Fonts.$poppinsregular }}>{I18n('Fun_factor')}</Text>
              </View>
              <TouchableOpacity onPress={() => selectSurvery("funFactor", true)} style={{ flex: 0.5 }}><Text style={[funFactorState.funFactor ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>SI</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => selectSurvery("funFactor", false)} style={{ flex: 0.5 }}><Text style={[!funFactorState.funFactor ? { color: Colors.$red, fontWeight: "800" } : { color: Colors.$gray, fontWeight: "600" }, { textAlign: "center", fontFamily: Fonts.$poppinsregular, fontSize: 12 }]}>NO</Text></TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ marginLeft: 'auto', marginRight: 'auto', width: 120, marginBottom: 20, height: 35 }}>
          <ButtonComponent text={I18n('Send')} fontFamily={Fonts.$montserratExtraBold} color="white" backgroundColor={Colors.$red} onTouch={() => { sendSync() }} />
        </View>
        {
          //endrow
        }
      </View>
    )
}

function mapStateToProps(state) {
  return {
    dataOthers: state.othersReducer,
    dataUser: state.userReducer
  }
}
function mapDispatchToProps(dispatch) {
  return {
    sycnAction: (syncSettings) => dispatch(sycnAction(syncSettings)),
    postUserTrackings: (id, parameters) => dispatch(postUserTrackings(id, parameters)),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuizComponent);
