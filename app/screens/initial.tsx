import React, { useState } from 'react';
import { Button, View, StyleSheet, ImageBackground, Image } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import LoginForm from '@/components/ui/login-form';
import SingUpForm from '@/components/ui/singup-form';

export default function InitialScreen() {
    const [showLogin, setShowLogin] = useState(false);
    const [singUpShow, setSingUpShow] = useState(false);

    const image = require('@/assets/images/logo2.png');

    return (
        <ThemedView style={styles.container}>
            {!showLogin && !singUpShow && <Image source={image} style={{ width: 400, height: 400 }} />}
            {/* <ImageBackground source={image} style={styles.background} resizeMode="contain"> */}
            {showLogin ? (
                <View style={styles.formContainer}>
                    <LoginForm onBack={() => setShowLogin(false)} />
                </View>
            ) : singUpShow ? null : (
                <View style={styles.buttonContainer}>
                    <Button
                        title="Entrar"
                        onPress={() => setShowLogin(true)}
                    />

                    <Button
                        title="Criar uma conta"
                        onPress={() => setSingUpShow(true)}
                    />
                </View>
            )}
            {singUpShow && <SingUpForm onBack={() => setSingUpShow(false)} />}
        {/* </ImageBackground> */}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    background: {
        width: '100%',
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '80%',
        gap: 12,
    },
    formContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
