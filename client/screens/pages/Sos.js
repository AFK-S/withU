import React, { useEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Linking,
  Platform,
  Device,
  TouchableWithoutFeedback,
  Image,
} from 'react-native'
import { Audio } from 'expo-av'
import Styles from '../../CommonStyles'
import * as SMS from 'expo-sms'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import * as Communications from 'react-native-communications'
import FakeCall from './FakeCall'
import { useNavigation } from '@react-navigation/native'

const Sos = () => {
  const navigation = useNavigation()

  // fetch location
  const [location, setLocation] = useState(null)

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
      }
      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  //   fake call

  // const PhoneCall = () => {
  //   const handlePhoneCall = () => {
  //     const phoneNumber = '8169645464'
  //     Linking.openURL(`tel:${phoneNumber}`)
  //   }
  // }

  // not working fake call

  // const handleCallButtonPress = () => {
  //   Communications.phonecall('1234567890', true)
  // }

  // send SMS

  const sendSMS = () => {
    const { latitude, longitude } = location.coords
    const phoneNumber = ['+919619691591', '+918169645464']
    const message = `I am in danger. Please help me. My location is https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`

    SMS.sendSMSAsync(phoneNumber, message)
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  //   siren sound

  const [sound, setSound] = React.useState()

  async function playSound() {
    console.log('Loading Sound')
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sos.mp3'),
    )
    setSound(sound)
    sendSMS()
    console.log('Playing Sound')
    await sound.playAsync()
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound')
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            borderColor: 'red',
            borderWidth: 7,
            borderRadius: 100,
            padding: 10,
          }}
        >
          <TouchableOpacity style={styles.sosButton} onPress={playSound}>
            <Text style={styles.buttonText}>SOS</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('FakeCall')}>
            <Text>Load Image</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    backgroundColor: 'red',
    width: 150,
    height: 150,
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: 'red',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: Styles.bold.fontFamily,
  },
})

export default Sos
