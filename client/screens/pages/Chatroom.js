import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
} from 'react-native'
import Styles from '../../CommonStyles'
import React, { useState, useEffect } from 'react'

const Chatroom = ({ socket, sos_id, user_name }) => {
  const [chatModalVisible, setChatModalVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')

  socket.on('previous-messages', (msg) => {
    setMessages((prevMessages) => [...prevMessages, msg])
  })

  socket.on('receive-message', (msg) => {
    setMessages((prevMessages) => [...prevMessages, msg])
  })

  const renderItem = ({ item }) => {
    console.log(item)
    return (
      <View style={styles.message}>
        <Text style={styles.text}>{item}</Text>
      </View>
    )
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          socket.on('join-room', sos_id, user_name)
          setChatModalVisible(true)
        }}
      >
        <Text style={styles.btnText}>Chat Room</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={chatModalVisible}
        onRequestClose={() => setChatModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#00000080',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 15,
              elevation: 5,
              shadowColor: '#c6c6c678',
              marginVertical: 5,
              shadowOffset: {
                width: 0,
                height: 2,
              },
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
              }}
            >
              <Text style={styles.modal_head}>Chat</Text>
              <TouchableOpacity
                style={{ padding: 15, paddingTop: 0 }}
                onPress={() => setChatModalVisible(false)}
              >
                <Image
                  source={require('../../assets/icons/close.png')}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    alignSelf: 'flex-end',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <FlatList
                data={messages}
                renderItem={renderItem}
                // keyExtractor={(item, index) => index.toString()}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                  placeholder="Type your message here"
                />
                <Button
                  title="Send"
                  onPress={() => {
                    socket.emit('send-message', message, user_name, sos_id)
                    setMessage('')
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Chatroom

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#FFAACF',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  btnText: {
    ...Styles.medium,
  },
  modal_head: {
    ...Styles.medium,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  usernameContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    width: '100%',
  },
  usernameInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    width: '100%',
  },
  input: {
    height: 40,
    width: '80%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
  },
  message: {
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  text: {
    fontSize: 16,
  },
})
