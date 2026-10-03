import { use, useState } from "react";
import { TextInput, Button, StyleSheet, View, Text, TouchableOpacity, ToastAndroid, Alert } from "react-native";
import { ThemedView } from "../themed-view";
import { Link } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

interface SingUpFormProps {
    onBack: () => void
}

export default function SingUpForm({ onBack }: SingUpFormProps) {
    const [showError, setShowError] = useState(false);
    const [nome, setNome] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [confirmEmail, setConfirmEmail] = useState<string>('');
    const [cpf, setCpf] = useState<number>(0);
    const [telefone, setTelefone] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [confirmSenha, setConfirmSenha] = useState<string>('');

    const cadastrar =  async () => {
        try {
            const response = await fetch('http://192.168.1.121:8080/aplicativo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    confirmar_email: confirmEmail,
                    cpf: cpf,
                    telefone: telefone,
                    senha: senha,
                    confirmar_senha: confirmSenha
                })
            });

            if (!response.ok) {
                ToastAndroid.show('Erro inesperado. Contate o suporte técnico', 1000);
                return;
            }

            ToastAndroid.show('Cadastrado com sucesso', 1000);
            onBack();
        } catch (error) {
            Alert.alert("Erro ao cadastrar")
        }
    }

    return (
        <ThemedView style={styles.container}>
            <Text style={styles.title}>Novo Usuário</Text>
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
                    onChangeText={(e) => setNome(e)}
                />

                {/* <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display="default"
                    onChange={(_, selectedDate) => {
                        if (selectedDate) {
                            setBirthDate(selectedDate);
                        }
                    }}
                /> */}

                {/* <TextInput
                    placeholder="Data de Nascimento"
                    style={styles.input}
                    value={birthDate.toLocaleDateString()}
                    editable={false}
                /> */}

                <TextInput
                    placeholder="E-mail"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(e) => setEmail(e)}
                />

                {/* <TextInput
                    placeholder="RG"
                    style={styles.input}
                    autoCapitalize="none"
                /> */}

                <TextInput
                    placeholder="Confirmar E-mail"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(e) => setConfirmEmail(e)}
                />

                <TextInput
                    placeholder="CPF"
                    style={styles.input}
                    autoCapitalize="none"
                    onChangeText={(e) => setCpf((Number(e)))}
                />

                <TextInput
                    placeholder="Telefone"
                    style={styles.input}
                    autoCapitalize="none"
                    onChangeText={(e) => setTelefone(e)}
                />

                <TextInput
                    placeholder="Senha"
                    style={styles.input}
                    secureTextEntry
                    onChangeText={(e) => setSenha(e)}
                />

                <TextInput
                    placeholder="Confirmar Senha"
                    style={styles.input}
                    secureTextEntry
                    onChangeText={(e) => setConfirmSenha(e)}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title="Criar Conta"
                        onPress={() => cadastrar()}
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
    },
    title: {
        fontSize: 25,
        paddingBottom: 20
    }
});
