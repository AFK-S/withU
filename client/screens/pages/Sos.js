import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const SOSButton = ({ onPress }) => (
    <Ripple onPress={onPress} style={styles.sosButtonContainer}>
        <Text style={styles.sosButtonText}>SOS</Text>
    </Ripple>
);

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sosButtonContainer: {
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 50,
        height: 70,
        justifyContent: 'center',
        width: 70,
    },
    sosButtonText: {
        color: 'white',
        fontSize: 24,
    },
};
const Tab = createBottomTabNavigator();
export default class MyPage extends React.Component {
    handleSOSPress = () => {
        // Do something when the SOS button is pressed
    };

    render() {
        return (
            <View style={styles.container}>
                <SOSButton onPress={this.handleSOSPress} />
            </View>
        );
    }
}