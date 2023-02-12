import { StyleSheet, View,Image,Text} from 'react-native'
import React from 'react'
import Sos from './pages/Sos';
import Map from './pages/Map';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const MainScreen = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator 
        screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        elevation: 0,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        height: 90,
        ... styles.shadow
            }
        }}>
            <Tab.Screen name='SOS' component={Sos} 
            options={{
                tabBarIcon: ({})=> (
                    <View style={{alignItems:'center',justifyContent:'center', top:10}}>
                    <Image
                        source={require('../assets/icons/sos.png')}
                        resizeMode='contain'
                        style={{
                            width:45,
                            height:45,
                          
                        }}/>
                        <Text style={{fontSize:10}}>SOS</Text>
                    </View>
                )
            }} 
            />
            <Tab.Screen name='MAP' component={Map} 
                        options={{
                            tabBarIcon: ({})=> (
                                <View style={{alignItems:'center',justifyContent:'center', top:10}}>
                                <Image
                                    source={require('../assets/icons/map.png')}
                                    resizeMode='contain'
                                    style={{
                                        width:45,
                                        height:45,
                                      
                                    }}/>
                                    <Text style={{fontSize:10}}>MAP</Text>
                                </View>
                            )
                        }} />
            <Tab.Screen name='ALERT' component={Map}
                        options={{
                            tabBarIcon: ({})=> (
                                <View style={{alignItems:'center',justifyContent:'center', top:10}}>
                                <Image
                                    source={require('../assets/icons/alert.png')}
                                    resizeMode='contain'
                                    style={{
                                        width:45,
                                        height:45,
                                      
                                    }}/>
                                    <Text style={{fontSize:10}}>ALERT</Text>
                                </View>
                            )
                        }}  />
        </Tab.Navigator>
    )
}

export default MainScreen

const styles = StyleSheet.create({
    shadow:{
        shadowColor:'#FFAACF',
        shadowOffset:{
            width:0,
            height:10
        },
        shadowOpacity: 0.35,
        shadowRadius:4,
        elevation:5

    }
})