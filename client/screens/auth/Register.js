import {
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { useState } from 'react'
import Styles from '../../CommonStyles'

const Register = ({ navigation }) => {
  const [register, setRegister] = useState({
    name: '',
    email_address: '',
    password: '',
  })

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={{ width: '100%', maxWidth: 500 }}>
        <Text style={[Styles.bold, styles.title]}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(text) => setRegister({ ...register, name: text })}
          value={register.name}
          autoCapitalize="none"
          autoComplete="off"
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          onChangeText={(text) =>
            setRegister({ ...register, email_address: text })
          }
          value={register.email_address}
          autoCapitalize="none"
          autoComplete="off"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setRegister({ ...register, password: text })}
          autoCapitalize="none"
          autoComplete="off"
          value={register.password}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('register2', {
              cred: register,
              setCred: setRegister,
            })
          }
          style={{ ...Styles.button, marginTop: 10 }}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => navigation.navigate('login')}
        >
          <Text
            style={{
              textAlign: 'center',
              fontFamily: Styles.medium.fontFamily,
            }}
          >
            Back to Login
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 50,
  },
  input: {
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: Styles.bold.fontFamily,
    fontSize: 18,
  },
})

export default Register
