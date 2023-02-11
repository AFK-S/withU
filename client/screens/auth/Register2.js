import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';
import Styles from '../../CommonStyles';

const Register2 = ({ navigation }) => {
    const [detail, setDetail] = useState({
        name: '',
        phone: '',
        address: '',
        pin_code: ''

    })
    const handleLogin = () => {
        console.log(`name: ${detail.name}, Password: ${detail.phone} & ${detail.address} & ${detail.pin_code}`);
        navigation.navigate('login')
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ width: "100%", maxWidth: 500 }}>
                <Text style={[Styles.bold, styles.title]}>Tell us more about you :)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Full name"
                    onChangeText={(text) => setDetail({ ...detail, name: text })}
                    value={detail.name}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType='numeric'
                    onChangeText={(text) => setDetail({ ...detail, phone: text })}
                    value={detail.phone}
                />
                <TextInput
                    style={{
                        ...styles.input, height: 100, overflow: "scroll", textAlignVertical: "top", paddingTop: 15
                    }}
                    placeholder="Address"
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(text) => setDetail({ ...detail, address: text })}
                    value={detail.address} />
                <TextInput
                    style={styles.input}
                    placeholder="Pin code"
                    keyboardType='numeric'
                    onChangeText={(text) => setDetail({ ...detail, pin_code: text })}
                    value={detail.pin_code}
                />
                <TouchableOpacity onPress={handleLogin} style={{ ...Styles.button, marginTop: 10 }}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate('register')}>
                    <Text style={{ textAlign: "center", fontFamily: Styles.medium.fontFamily }}>Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}

export default Register2

const styles = StyleSheet.create({
    container: {
        padding: 40,
        backgroundColor: '#fff',
        flex: 1,
        display: "flex",
        alignItems: "center",
        // justifyContent: "center",
        paddingTop: 100
    },
    input: {
        height: 50,
        marginBottom: 30,
        paddingHorizontal: 15,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    buttonContainer: {
        backgroundColor: '#2980b9',
        paddingVertical: 15,
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: Styles.bold.fontFamily,
        fontSize: 18
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 50,
    }
});
