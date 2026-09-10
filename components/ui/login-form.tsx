import { TextInput, Button, StyleSheet, View, TouchableOpacity , Text} from "react-native";
import { ThemedView } from "../themed-view";
import { Link } from "expo-router";
import ModalRecuperacaoSenha from "./modal-recuperacao-senha";
import { useState } from "react";

interface LoginFormProps {
    onBack: () => void
}

export default function LoginForm({ onBack }: LoginFormProps) {

    const [recuperacao, setRecuperacao] = useState<boolean>(false);
    
    return (
        <ThemedView style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    placeholder="E-mail"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Senha"
                    style={styles.input}
                    secureTextEntry
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title="Acessar"
                        onPress={() => console.log("Acessar")}
                    />

                    <TouchableOpacity style={styles.link} onPress={() => setRecuperacao(true)}>
                        <Text>Esqueceu sua senha?</Text>
                    </TouchableOpacity>

                    <Link href="/screens/initial" style={styles.link} onPress={onBack}>
                        Voltar
                    </Link>
                </View>
            </View>
            <ModalRecuperacaoSenha open={recuperacao} setOpen={setRecuperacao}/>
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
});
