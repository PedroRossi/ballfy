import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Picker } from 'react-native';
import { Accelerometer, Audio } from 'expo';

const samplesFolder = 'samples';
const samples = [
  'BDRUM13.wav',
  'CLAPPO0.wav',
  'CRASH.wav',
  'HHCLOSE.wav',
  'HHOPEN.wav',
  'RIDE.wav',
  'SNARE.wav',
  'SPLASH1.wav',
  'TOMHI5.wav',
  'TOMLOW5.wav',
  'TOMMID5.wav',
];
const samplesData = [
  require('./samples/BDRUM13.wav'),
  require('./samples/CLAPPO0.wav'),
  require('./samples/CRASH.wav'),
  require('./samples/HHCLOSE.wav'),
  require('./samples/HHOPEN.wav'),
  require('./samples/RIDE.wav'),
  require('./samples/SNARE.wav'),
  require('./samples/SPLASH1.wav'),
  require('./samples/TOMHI5.wav'),
  require('./samples/TOMLOW5.wav'),
  require('./samples/TOMMID5.wav'),
]

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sample: samples[0],
      accelerometerData: {},
      soundObject: null
    };
  }

  async componentDidMount() {
    this._toggle();
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(samplesData[0]);
      this.setState({ soundObject })
    } catch (error) {
      // An error occurred!
    }
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  }

  _slow = () => {
    Accelerometer.setUpdateInterval(1000); 
  }

  _fast = () => {
    Accelerometer.setUpdateInterval(16);
  }

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  updateSample = async (itemValue, itemIndex) => {
    const sample = samples[itemIndex];
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(samplesData[itemIndex]);
      this.setState({ soundObject, sample });
    } catch (error) {
      // An error occurred!
    }
  }

  pressBall = async () => {
    await this.state.soundObject.stopAsync();
    await this.state.soundObject.playAsync();
  }

  render() {
    let { x, y, z } = this.state.accelerometerData;
    const round = (n) => (!n ? 0 : (Math.floor(n * 100) / 100));

    return (
      <View style={styles.container}>

        <Text>{'Accelerometer:'}</Text>
        <Text>{`x: ${round(x)} y: ${round(y)} z: ${round(z)}`}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>{'Toggle'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>{'Slow'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>{'Fast'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={this.pressBall}
          style={styles.ball}
        >
          <View style={styles.ball}>
            <Text>Apertar Bola</Text>
          </View>
        </TouchableOpacity>

        <Picker
          selectedValue={this.state.sample}
          style={styles.picker}
          onValueChange={this.updateSample}
        >
          {samples.map(s => 
            <Picker.Item key={s} label={s.substring(0, s.length - 4)} value={s} />
          )}
        </Picker>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ball: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#4FACD1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
    marginBottom: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    height: 50,
    width: 150
  }
});
