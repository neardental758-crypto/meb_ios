import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { validateRestorePassword } from '../../Utils/validation';
import styles from './Styles/RestorePasswordScreen.style';

function RestorePasswordScreen (props){

  const [ state , setState ] = useState({
      email: '',
      password: '',
      confirmPassword: '',
    });

  const forgotPasswordSubmit = () => {
    var errors = validateRestorePassword(state);
    if (errors.length == 0) {
      console.log(state);
      console.log("Success 'Restore Password'");
    }else{
      console.log(errors);
      console.log("'Restore Password' Failed");
    }
  };

    return(
      <View style={styles.loginCont}>
        <Text style={styles.loginSubTitle}>New Password</Text>
        <View>
          <Text style={styles.labelInput}>Email</Text>
          <TextInput
            placeholder='Enter email'
            autoCompleteType={'email'}
            style={styles.textInput}
            keyboardType={'email-address'}
            value={state.email}
            onChangeText={text => setState({ ...state , email: text })}
          />
        </View>
        <View>
          <Text style={styles.labelInput}>Password</Text>
          <TextInput
            placeholder='Enter new password'
            autoCompleteType={'password'}
            style={styles.textInput}
            secureTextEntry={true}
            value={state.password}
            onChangeText={passwordObject => setState({ ...state , password: passwordObject })}
          />
        </View>
        <View>
          <Text style={styles.labelInput}>Repeat assword</Text>
          <TextInput
            placeholder='Repeat new password'
            autoCompleteType={'password'}
            style={styles.textInput}
            secureTextEntry={true}
            value={state.confirmPassword}
            onChangeText={confirmPasswordObject => setState({ ...state , confirmPassword: confirmPasswordObject })}
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
export { RestorePasswordScreen };
