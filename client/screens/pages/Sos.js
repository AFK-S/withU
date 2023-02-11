import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Sos = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.sosButton}>
                <Text style={styles.buttonText}>SOS</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // padding: 20,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
        sosButton: {
        // backgroundColor: 'red',
        // paddingVertical: 15,
        // marginVertical:350,
        // borderRadius: 50
        backgroundColor: "red",
        width: 150,
        height: 150,
        borderRadius: 200,
        alignItems: "center",
        justifyContent: 'center',

    },
        buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    }
})

export default Sos;
