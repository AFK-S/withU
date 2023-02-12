import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import Styles from '../../CommonStyles'

const Alerts = () => {
    const alertList = [
        {
            raisedBy: "XYZ",
            location: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi, illum?",
            time: "12 : 00 : 30, 12/12/2020"
        },
        {
            raisedBy: "XYZ",
            location: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi, illum?",
            time: "12 : 00 : 30, 12/12/2020"
        },
        {
            raisedBy: "XYZ",
            location: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi, illum?",
            time: "12 : 00 : 30, 12/12/2020"
        },
        {
            raisedBy: "XYZ",
            location: "XYZ",
            time: "XYZ"
        },
        {
            raisedBy: "XYZ",
            location: "XYZ",
            time: "XYZ"
        },
    ]
    return (
        <View style={{ paddingHorizontal: 20, flex: 3.3 / 4 }}>
            <FlatList data={alertList} renderItem={({ item }) => {
                return (
                    <View style={styles.card}>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <Text style={styles.raisedBy}>Raised By : </Text>
                            <Text style={styles.rbName}>{item.raisedBy}</Text>
                        </View>
                        <Text style={{ ...styles.raisedBy, marginVertical: 10 }}>Location : {item.location}</Text>
                        <Text style={styles.raisedBy}>Time : {item.time}</Text>
                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.btnText}>Get Directions</Text>
                        </TouchableOpacity>
                    </View>
                )
            }} showsVerticalScrollIndicator={false} />
        </View>
    )
}

export default Alerts

const styles = StyleSheet.create({
    title: {
        ...Styles.medium,
        fontSize: 30,
        marginTop: 20
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        marginTop: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginVertical: 10
    },
    raisedBy: {
        ...Styles.medium,
        fontSize: 15,
    },
    rbName: {
        ...Styles.bold,
    },
    btn: {
        backgroundColor: "#FFAACF",
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    btnText: {
        ...Styles.medium,
    }
})