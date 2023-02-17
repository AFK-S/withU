import { StyleSheet, Text, View ,SafeAreaView} from 'react-native'
import { WebView } from 'react-native-webview';
import React from 'react'

const Help = () => {
  return (
    <View style={styles.container}>
        <WebView
        source={{
          uri: 'https://www.google.com/maps/search/police+station+and+hospitals+near+me/',
        }}
      />
    </View>
  )
}

export default Help

const styles = StyleSheet.create({
    container: {
        flex: 3.4/4,
      }
})