import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native'
import React, { useState } from 'react'
import Styles from '../../CommonStyles'

const Alerts = ({ navigation, socket, User }) => {
  const [AlertList, setAlertList] = useState([])

  socket.emit('Get_SOS_details', User.user_id, (data) => {
    setAlertList(data)
  })

  const GetDirection = (user_id, user_list = []) => {
    const list = user_list.filter((user) => {
      return user.user_id === User.user_id
    })
    if (list.length === 0) {
      socket.emit('SOS_Accepted', user_id, User.user_id)
    }
    // navigation.navigate('MAP', {
    //   user_id: user_id,
    // })
    socket.emit('Get_Location', user_id, async (location) => {
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
                    <Text style={styles.rbName}>{item.name}</Text>
                  </View>
                  <Text style={{ ...styles.raisedBy }}>
                    Phone Number : {item.phone_number}
                  </Text>
                  <Text style={styles.raisedBy}>
                    Time : {new Date(item.time).toLocaleString()}
                  </Text>
                  {item.accepted_list && (
                    <Text style={styles.rbName}>Accepted By</Text>
                  )}
                  {item.accepted_list && (
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
                  )}
                  {User.user_id !== item.user_id && (
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() =>
                        GetDirection(item.user_id, item.accepted_list)
                      }
                    >
                      <Text style={styles.btnText}>Get Directions</Text>
                    </TouchableOpacity>
                  )}
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
})
