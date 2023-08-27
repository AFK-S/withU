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
  RefreshControl,
  Alert,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Styles from '../../CommonStyles'
import StateContext from '../../context/StateContext'
import axios from 'axios'
import { SERVER_URL } from '../../config'
import CommonStyles from '../../CommonStyles.js'

const Alerts = () => {
  const [refreshing, setRefreshing] = useState(false)
  const { socket, setLoading, User } = useContext(StateContext)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [acceptedList, setAcceptedList] = useState([])
  const [AlertList, setAlertList] = useState([])

  const Get_SOS_details = async () => {
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/sos/details/${User.user_id}`,
      )
      setAlertList(data)
    } catch (err) {
      alert(err)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/sos/details/${User.user_id}`,
      )
      setAlertList(data)
      setRefreshing(false)
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    setLoading(true)
    Get_SOS_details()
    setLoading(false)
  }, [socket.connected])

  useEffect(() => {
    socket.on('Refetch_SOS_Details', () => Get_SOS_details())
    return () => {
      socket.off('Refetch_SOS_Details')
    }
  }, [socket.connected])

  const AcceptRequest = async (user_id, sos_id) => {
    try {
      await axios.post(`${SERVER_URL}/api/sos/accepted`, { sos_id, user_id })
    } catch (err) {
      alert(err)
    }
  }

  const GetDirection = async (user_id, sos_id) => {
    if (!socket.connected) return alert('Please Connect to Socket')
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/active/location/${user_id}`,
      )
      const url = `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}&travelmode=walking`
      Linking.openURL(url)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <View style={{ paddingHorizontal: 20, flex: 3.3 / 4 }}>
      {AlertList.length === 0 || AlertList[0] === null ? (
        <Text style={styles.silent}>No Alerts</Text>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={AlertList}
          renderItem={({ item }) => {
            return (
              item !== null && (
                <View style={styles.card}>
                  <View
                    style={{
                      position: 'relative',
                    }}
                  >
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Text style={styles.raisedBy}>Raised By : </Text>
                      <Text style={styles.rbName}>{item.user.name}</Text>
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert('User Reported')
                        }}
                      >
                        <Image
                          source={require('../../assets/icons/warning.png')}
                          resizeMode="contain"
                          style={{ width: 30, height: 30, zIndex: 1 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{ ...styles.raisedBy }}>
                    Phone Number : {item.user.phone_number}
                  </Text>
                  <Text
                    style={{ ...styles.raisedBy, textTransform: 'capitalize' }}
                  >
                    Description : {item.description}
                  </Text>
                  <Text style={{ ...styles.raisedBy, marginBottom: 10 }}>
                    Time : {new Date(item.createdAt).toLocaleString()}
                  </Text>
                  {User.user_id !== item.user._id && (
                    <>
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                          setModalVisible2(true)
                          GetDirection(User.user_id, item._id)
                        }}
                      >
                        <Text style={styles.btnText}>Get Directions</Text>
                      </TouchableOpacity>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible2}
                        onRequestClose={() => false}
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
                            <View>
                              <View
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Text style={styles.modal_head}>
                                  Accept or Reject Request?
                                </Text>
                                <TouchableOpacity
                                  style={{ padding: 15, paddingTop: 0 }}
                                  onPress={() => setModalVisible2(false)}
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
                              <View
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'space-around',
                                  width: '100%',
                                }}
                              >
                                <TouchableOpacity
                                  style={{
                                    ...styles.btn,
                                    ...styles.btn_width,
                                    backgroundColor: 'white',
                                    borderWidth: 2,
                                    borderColor: '#7d40ff',
                                  }}
                                  onPress={() => {
                                    setModalVisible2(false)
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...styles.btnText,
                                      color: '#000',
                                    }}
                                  >
                                    Reject
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[styles.btn, styles.btn_width]}
                                  onPress={() => {
                                    setModalVisible2(false)
                                    AcceptRequest(User.user_id, item._id)
                                  }}
                                >
                                  <Text style={styles.btnText}>Accept</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      </Modal>
                    </>
                  )}
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={async () => {
                      try {
                        const { data } = await axios.get(
                          `${SERVER_URL}/api/sos/accepted/${item._id}`,
                        )
                        setAcceptedList(data)
                        setModalVisible(true)
                      } catch (error) {
                        alert(error)
                      }
                    }}
                  >
                    <Text style={styles.btnText}>Accepted Users</Text>
                  </TouchableOpacity>
                  <SafeAreaView>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => false}
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
                              style={{ padding: 15, paddingTop: 0 }}
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
                                  <View
                                    style={{
                                      marginBottom: 10,
                                    }}
                                  >
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
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
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
    zIndex: -1,
  },
  btn_width: {
    width: '40%',
    width: '40%',
  },
  rbName: {
    ...Styles.bold,
    textTransform: 'capitalize',
    textTransform: 'capitalize',
  },
  btn: {
    backgroundColor: CommonStyles.bg.backgroundColor,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    alignItems: 'center',
  },
  btnText: {
    ...Styles.medium,
    color: '#fff',
    color: '#fff',
  },
  silent: {
    ...Styles.medium,
    fontSize: 20,
    color: '#aaa',
    color: '#aaa',
    marginTop: 20,
    textAlign: 'center',
    marginTop: '70%',
    textAlign: 'center',
    marginTop: '70%',
  },
  modal_head: {
    ...Styles.medium,
    fontSize: 20,
    textAlign: 'center',
    textAlign: 'center',
    marginBottom: 20,
  },
})
