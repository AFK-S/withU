import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import Sos from './Sos'

const FakeCall = ({ navigation }) => {
  const handleImagePress = () => {
    navigation.navigate('Sos')
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={{ flex: 1 }} onPress={handleImagePress}>
        <Image
          source={require('../../assets/fakecall.jpeg')}
          style={{ flex: 1, resizeMode: 'cover' }}
        />
      </TouchableOpacity>
    </View>
  )
}

export default FakeCall
