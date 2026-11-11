import { TextInput, Button, StyleSheet, View, TouchableOpacity , Text, ToastAndroid} from "react-native";
import { ThemedView } from "../themed-view";
import { Link, useRouter } from "expo-router";
import ModalRecuperacaoSenha from "./modal-recuperacao-senha";
import { useContext, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { API_URL } from "@/constants/Util";

interface LoginFormProps {
    onBack: () => void
}

export default function LoginForm({ onBack }: LoginFormProps) {

    const [recuperacao, setRecuperacao] = useState<boolean>(false);
    const [email, setEmail] = useState<string>();
    const [senha, setSenha] = useState<string>();

    const router = useRouter();
    const context = useContext(AppContext);

    const login = async () => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    senha:  senha,
                    isAplicativo: true
                })
            });

            const data = await response.json();

            if (!response.ok) {
                ToastAndroid.show(
                    data?.aviso ?? 'Erro ao logar',
                    ToastAndroid.LONG
                );
                return;
            }

            context.setToken(data.token);
            router.replace("/screens/home");
        } catch (erro) {
            console.error('Erro no fetch:', erro);

            ToastAndroid.show(
                'Não foi possível conectar ao servidor',
                ToastAndroid.LONG
            );
        }
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    placeholder="E-mail"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(e) => setEmail(e)}
                />

                <TextInput
                    placeholder="Senha"
                    style={styles.input}
                    secureTextEntry
                    onChangeText={(e) => setSenha(e)}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title="Acessar"
                        onPress={() => login()}
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
