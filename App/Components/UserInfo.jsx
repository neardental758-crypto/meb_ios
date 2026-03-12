import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

function UserInfoComponent(props){
    return(
      <View>
        {props.dataUser.user.username ? <View><Text style={{color: '#8cc63f'}}>User: {props.dataUser.user.email} - {props.dataUser.userInfo.name}</Text></View> : <View><Text style={{color: '#b81d2e'}}>User not logged in</Text></View>}
      </View>
    );
}
function mapStateToProps (state) {
  return {
    dataUser: state.userReducer
  }
}
export default connect(
  mapStateToProps,
)(UserInfoComponent);
