import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class Cronometro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      miliseconds: 0,
      isRunning: false,
    };
  }

  handleStartStop = () => {
    if (this.state.isRunning) {
      clearInterval(this.timer);
      this.setState({ isRunning: false });
    } else {
      this.setState({ isRunning: true });
      this.timer = setInterval(() => {
        let miliseconds = this.state.miliseconds + 10;
        let seconds = this.state.seconds;
        let minutes = this.state.minutes;
        let hours = this.state.hours;
        if (miliseconds === 1000) {
          miliseconds = 0;
          seconds++;
        }
        if (seconds === 60) {
          seconds = 0;
          minutes++;
        }
        if (minutes === 60) {
          minutes = 0;
          hours++;
        }
        this.setState({ miliseconds, seconds, minutes, hours });
      }, 10);
    }
  };

  handleReset = () => {
    clearInterval(this.timer);
    this.setState({
      hours: 0,
      minutes: 0,
      seconds: 0,
      miliseconds: 0,
      isRunning: false,
    });
  };

  render() {
    const { hours, minutes, seconds, miliseconds, isRunning } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.timeText}>
          {`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${miliseconds < 100 ? '0' : ''}${miliseconds}`}
        </Text>
        <TouchableOpacity onPress={this.handleStartStop, prueba()} style={styles.button}>
          <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleReset} style={styles.button}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  timeText: {
    fontSize: 80,
    
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    
    fontSize: 20,
  },
});

export default Cronometro;