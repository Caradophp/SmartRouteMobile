import React, { useState } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import LoginForm from '@/components/ui/login-form';
import SingUpForm from '@/components/ui/singup-form';

export default function InitialScreen() {
    const [showLogin, setShowLogin] = useState(false);
    const [singUpShow, setSingUpShow] = useState(false);

    return (
        <ThemedView style={styles.container}>
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
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
