import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Styles from '../../CommonStyles'

const GetStarted = ({ navigation }) => {
  return (
    <View style={styles.mainCon}>
      <View style={styles.upperPattern}></View>
      <View style={styles.textCon}>
        <Image
          source={require('../../assets/logo.jpg')}
          style={{ width: 150, height: 150, borderRadius: 100 }}
        />
        <Text style={[Styles.bold, styles.title]}>withU</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('login')}
        >
          <Text
            style={{
              color: '#fff',
              fontFamily: Styles.bold.fontFamily,
              fontSize: 18,
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainCon: {
    flex: 1,
    width: '100%',
  },
  upperPattern: {
    backgroundColor: Styles.bg.backgroundColor,
    height: '40%',
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
  },
  textCon: {
    display: 'flex',
    alignItems: 'center',
    marginTop: -80,
  },
  title: {
    fontSize: 50,
    marginTop: 10,
  },
  btn: {
    backgroundColor: Styles.bg.backgroundColor,
    paddingVertical: 12,
    borderRadius: 12,
    position: 'absolute',
    top: '180%',
    paddingHorizontal: 50,
  },
})

export default GetStarted
