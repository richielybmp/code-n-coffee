import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import { Alert, View, SafeAreaView, ScrollView, AsyncStorage, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import SpotList from '../components/SpotList';

import logo from '../assets/logo.png';

export default function List({ navigation }) {

    const [techs, setTechs] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('user').then(user_id => {
            const socket = socketio('http://192.168.25.48:3333', {
                query: { user_id }
            })

            socket.on('booking_response', booking => {
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}`);
            })
        });
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('techs').then(storageTechs => {
            const techsArray = storageTechs.split(',').map(tech => tech.trim());
            setTechs(techsArray);
        });

    }, []);

    function handleClear() {
        AsyncStorage.removeItem('techs');
        AsyncStorage.removeItem('user');
        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.logo} source={logo} />

            <TouchableOpacity style={styles.button} onPress={() => handleClear()}>
                <Text style={styles.buttonText}>
                    Sair
                </Text>
            </TouchableOpacity>

            <ScrollView>
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    logo: {
        height: 32,
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: 50
    },

    button: {
        height: 32,
        backgroundColor: '#f05a5b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 15
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    }
})