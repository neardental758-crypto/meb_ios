import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { validateForgotPassword } from '../../Utils/validation';
import styles from './Styles/ForgotPasswordScreen.style';
import { connect } from 'react-redux';

function ForgotPasswordScreen (){
  const [ state, setState ] = useState({
    email: '',
  });
  const forgotPasswordSubmit = () => {
    let errors = validateForgotPassword(state);
    if (errors.length == 0) {
      console.log(state);
    }else{
      console.log(errors);
    }
  };
    return(
      <View style={styles.loginCont}>
        <Text style={styles.loginSubTitle}>Forgot Password</Text>
        <View>
          <Text style={styles.labelInput}>Email</Text>
          <TextInput
            placeholder='Enter email'
            autoCompleteType={'email'}
            style={styles.textInput}
            keyboardType={'email-address'}
            value={state.email}
            onChangeText={text => setState({ email: text })}
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={forgotPasswordSubmit}
            style={styles.submitButton}>
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  function mapStateToProps(state) {
    return {
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ForgotPasswordScreen);
