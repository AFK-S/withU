import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
  Modal,
  Image,
  SafeAreaView,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import Styles from '../../CommonStyles'

const Alerts = ({ socket, User }) => {
  const [AlertList, setAlertList] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [acceptedList, setAcceptedList] = useState([])

  useEffect(() => {
    if (socket.connected) {
      socket.emit('Get_SOS_details', (data) => {
        setAlertList(data)
      })
    }
  }, [socket.connected])

  socket.on('Refetch_SOS_Details', () => {
    socket.emit('Get_SOS_details', (data) => {
      setAlertList(data)
    })
  })

  const GetDirection = (user_id, sos_user_id) => {
    if (!socket.connected) {
      alert('Please Connect to Internet')
      return
    }
    socket.emit('SOS_Accepted_Commity', sos_user_id)
    socket.emit('Get_SOS_Location', user_id, async (location) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}&travelmode=walking`
      Linking.openURL(url)
    })
  }

  return (
    <View style={{ paddingHorizontal: 20, flex: 3.3 / 4 }}>
      {AlertList.length === 0 || AlertList[0] === null ? (
        <Text style={styles.silent}>No Alerts</Text>
      ) : (
        <FlatList
          data={AlertList}
          renderItem={({ item }) => {
            return (
              item !== null && (
                <View style={styles.card}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text style={styles.raisedBy}>Raised By : </Text>
                    <Text style={styles.rbName}>{item.user.name}</Text>
                  </View>
                  <Text style={{ ...styles.raisedBy }}>
                    Phone Number : {item.user.phone_number}
                  </Text>
                  <Text style={styles.raisedBy}>
                    Time : {new Date(item.createdAt).toLocaleString()}
                  </Text>
                  {/* {item.accepted_list && (
                    <Text style={styles.rbName}>Accepted By</Text>
                  )} */}
                  {/* {item.accepted_list && (
                    <FlatList
                      data={item.accepted_list}
                      renderItem={(user) => {
                        return (
                          <View
                            style={{
                              backgroundColor: '#fff',
                              padding: 20,
                              borderRadius: 15,
                              elevation: 5,
                              shadowColor: '#000',
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
                              }}
                            >
                              <Text style={styles.raisedBy}>Person : </Text>
                              <Text style={styles.rbName}>
                                {user.item.name}
                              </Text>
                            </View>
                            <Text
                              style={{
                                ...styles.raisedBy,
                              }}
                            >
                              Phone Number : {user.item.phone_number}
                            </Text>
                          </View>
                        )
                      }}
                      showsVerticalScrollIndicator={false}
                    />
                  )} */}
                  {User.user_id !== item.user._id && (
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => GetDirection(item.user._id, item.owner_id)}
                    >
                      <Text style={styles.btnText}>Get Directions</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                      socket.emit(
                        'Get_SOS_Accepted_List',
                        item.owner_id,
                        (data) => {
                          setAcceptedList(data)
                          setModalVisible(true)
                        },
                      )
                    }}
                  >
                    <Text style={styles.btnText}>Accepted Users</Text>
                  </TouchableOpacity>
                  <SafeAreaView>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => setModalVisible(false)}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          paddingHorizontal: 20,
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
                            }}
                          >
                            <Text style={styles.modal_head}>Accepted User</Text>
                            <TouchableOpacity
                              onPress={() => setModalVisible(false)}
                            >
                              <Image
                                source={require('../../assets/icons/close.png')}
                                resizeMode="contain"
                                style={{
                                  width: 16,
                                  height: 16,
                                  alignSelf: 'flex-end',
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                          {acceptedList.length !== 0 ? (
                            <FlatList
                              data={acceptedList}
                              renderItem={(user) => {
                                return (
                                  <View>
                                    <View
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                      }}
                                    >
                                      <Text style={styles.raisedBy}>
                                        Person :{' '}
                                      </Text>
                                      <Text style={styles.rbName}>
                                        {user.item.name}
                                      </Text>
                                    </View>
                                    <Text
                                      style={{
                                        ...styles.raisedBy,
                                      }}
                                    >
                                      Phone Number : {user.item.phone_number}
                                    </Text>
                                  </View>
                                )
                              }}
                              showsVerticalScrollIndicator={false}
                            />
                          ) : (
                            <Text style={{ ...Styles.medium, fontSize: 15 }}>
                              No Accepted User
                            </Text>
                          )}
                        </View>
                      </View>
                    </Modal>
                  </SafeAreaView>
                </View>
              )
            )
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

export default Alerts

const styles = StyleSheet.create({
  title: {
    ...Styles.medium,
    fontSize: 30,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginVertical: 10,
  },
  raisedBy: {
    ...Styles.medium,
    fontSize: 15,
  },
  rbName: {
    ...Styles.bold,
    textTransform: 'capitalize',
  },
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
  silent: {
    ...Styles.medium,
    fontSize: 20,
    color: '#aaa',
    marginTop: 20,
    textAlign: 'center',
    marginTop: '70%',
  },
  modal_head: {
    ...Styles.medium,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
})
