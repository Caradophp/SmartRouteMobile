import { useState } from "react";
import { TextInput, Button, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { ThemedView } from "../themed-view";
import { Link } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

interface SingUpFormProps {
    onBack: () => void
}

export default function SingUpForm({ onBack }: SingUpFormProps) {
    const [birthDate, setBirthDate] = useState(new Date());
    const [showError, setShowError] = useState(false);

    return (
        <ThemedView style={styles.container}>
            <View style={styles.formContainer}>

                {showError && (
                    <View style={styles.erroMessage}>
                        <Text style={styles.erroBox}>Erro</Text>
                        <TouchableOpacity onPress={() => setShowError(false)}>
                            <Text style={styles.erroBox}>X</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TextInput
                    placeholder="Nome Completo"
                    style={styles.input}
                />

                <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display="default"
                    onChange={(_, selectedDate) => {
                        if (selectedDate) {
                            setBirthDate(selectedDate);
                        }
                    }}
                />

                <TextInput
                    placeholder="Data de Nascimento"
                    style={styles.input}
                    value={birthDate.toLocaleDateString()}
                    editable={false}
                />

                <TextInput
                    placeholder="E-mail"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="RG"
                    style={styles.input}
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="CPF"
                    style={styles.input}
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Confirmar E-mail"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Senha"
                    style={styles.input}
                    secureTextEntry
                />

                <TextInput
                    placeholder="Confirmar Senha"
                    style={styles.input}
                    secureTextEntry
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title="Criar Conta"
                        onPress={() => console.log("Acessar")}
                    />

                    <Link href="/screens/initial" style={styles.link} onPress={onBack}>
                        Voltar
                    </Link>
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },

    formContainer: {
        width: "80%",
        justifyContent: "center",
    },

    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#999",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },

    buttonContainer: {
        width: "100%",
        gap: 12,
        marginTop: 8,
    },

    link: {
        textAlign: "center",
        marginTop: 4,
    },

    erroMessage: {
        padding: 15,
        backgroundColor: 'red',
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    erroBox: {
        backgroundColor: 'red'
    }
});
