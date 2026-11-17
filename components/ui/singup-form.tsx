import { useState } from "react";
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ToastAndroid,
    Alert,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Image
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "../themed-view";
import { API_URL } from "@/constants/Util";

interface SingUpFormProps {
    onBack: () => void;
}

export default function SingUpForm({ onBack }: SingUpFormProps) {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const cadastrar = async () => {

        if (!nome.trim() || !email.trim() || !confirmEmail.trim() ||
            !cpf.trim() || !telefone.trim() || !senha || !confirmSenha) {

            Alert.alert("Atenção", "Preencha todos os campos.");
            return;
        }

        if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
            Alert.alert("Erro", "Os e-mails não correspondem.");
            return;
        }

        if (senha !== confirmSenha) {
            Alert.alert("Erro", "As senhas não correspondem.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            Alert.alert("Erro", "Informe um e-mail válido.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/aplicativo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    email: email.trim(),
                    confirmar_email: confirmEmail.trim(),
                    cpf: cpf.replace(/\D/g, ""),
                    telefone: telefone,
                    senha: senha,
                    confirmar_senha: confirmSenha,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                Alert.alert(
                    "Erro ao cadastrar",
                    data?.aviso ?? data?.message ?? "Não foi possível criar sua conta."
                );
                return;
            }

            if (Platform.OS === "android") {
                ToastAndroid.show("Cadastrado com sucesso!", ToastAndroid.LONG);
            } else {
                Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
            }

            onBack();

        } catch (error) {
            console.error("Erro ao cadastrar:", error);

            Alert.alert(
                "Erro",
                "Não foi possível conectar ao servidor."
            );

        } finally {
            setLoading(false);
        }
    };

    const image = require('@/assets/images/logo2.png');

    const renderInput = (
        placeholder: string,
        value: string,
        onChangeText: (text: string) => void,
        icon: keyof typeof Ionicons.glyphMap,
        options: any = {}
    ) => (
        <View style={styles.inputContainer}>
            <Ionicons
                name={icon}
                size={21}
                color="#64748b"
                style={styles.inputIcon}
            />

            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                {...options}
            />
        </View>
    );

    return (
        <ThemedView style={styles.container}>

            <KeyboardAvoidingView
                style={{ flex: 1, width: "100%" }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    {/* HEADER */}

                    <View style={styles.header}>

                        <View>
                            <Image source={image} style={{ width: 200, height: 200 }} />
                        </View>

                        <Text style={styles.title}>
                            Criar conta
                        </Text>

                        <Text style={styles.subtitle}>
                            Preencha seus dados para começar.
                        </Text>

                    </View>

                    {/* FORM */}

                    <View style={styles.formContainer}>

                        <Text style={styles.sectionTitle}>
                            Informações pessoais
                        </Text>

                        {renderInput(
                            "Nome completo",
                            nome,
                            setNome,
                            "person-outline",
                            { autoCapitalize: "words" }
                        )}

                        {renderInput(
                            "CPF",
                            cpf,
                            setCpf,
                            "card-outline",
                            { keyboardType: "numeric" }
                        )}

                        {renderInput(
                            "Telefone",
                            telefone,
                            setTelefone,
                            "call-outline",
                            { keyboardType: "phone-pad" }
                        )}

                        <Text style={styles.sectionTitle}>
                            Dados de acesso
                        </Text>

                        {renderInput(
                            "E-mail",
                            email,
                            setEmail,
                            "mail-outline",
                            {
                                keyboardType: "email-address",
                                autoCapitalize: "none",
                                autoCorrect: false,
                            }
                        )}

                        {renderInput(
                            "Confirmar e-mail",
                            confirmEmail,
                            setConfirmEmail,
                            "mail-open-outline",
                            {
                                keyboardType: "email-address",
                                autoCapitalize: "none",
                                autoCorrect: false,
                            }
                        )}

                        {/* PASSWORD */}

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={21}
                                color="#64748b"
                                style={styles.inputIcon}
                            />

                            <TextInput
                                placeholder="Senha"
                                placeholderTextColor="#94a3b8"
                                style={styles.input}
                                secureTextEntry={!showPassword}
                                value={senha}
                                onChangeText={setSenha}
                            />

                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color="#64748b"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* CONFIRM PASSWORD */}

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={21}
                                color="#64748b"
                                style={styles.inputIcon}
                            />

                            <TextInput
                                placeholder="Confirmar senha"
                                placeholderTextColor="#94a3b8"
                                style={styles.input}
                                secureTextEntry={!showConfirmPassword}
                                value={confirmSenha}
                                onChangeText={setConfirmSenha}
                            />

                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color="#64748b"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* REGISTER BUTTON */}

                        <TouchableOpacity
                            style={[
                                styles.registerButton,
                                loading && styles.disabledButton
                            ]}
                            onPress={cadastrar}
                            disabled={loading}
                            activeOpacity={0.8}
                        >

                            {loading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <>
                                    <Text style={styles.registerButtonText}>
                                        Criar minha conta
                                    </Text>

                                    <Ionicons
                                        name="arrow-forward"
                                        size={20}
                                        color="#ffffff"
                                    />
                                </>
                            )}

                        </TouchableOpacity>

                        {/* BACK BUTTON */}

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={onBack}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={18}
                                color="#2563eb"
                            />

                            <Text style={styles.backText}>
                                Voltar
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/* FOOTER */}

                    <Text style={styles.footer}>
                        SmartRoute © 2026
                    </Text>

                </ScrollView>

            </KeyboardAvoidingView>

        </ThemedView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#f8fafc",
    },

    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
        paddingVertical: 35,
        paddingHorizontal: 25,
    },

    header: {
        alignItems: "center",
        marginBottom: 30,
        marginTop: 15,
    },

    title: {
        fontSize: 29,
        fontWeight: "bold",
        color: "#1e293b",
    },

    subtitle: {
        fontSize: 14,
        color: "#64748b",
        marginTop: 8,
    },

    formContainer: {
        width: "100%",
        maxWidth: 450,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#334155",
        marginTop: 12,
        marginBottom: 12,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 55,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 14,
        paddingHorizontal: 15,
        marginBottom: 13,
    },

    inputIcon: {
        marginRight: 12,
    },

    input: {
        flex: 1,
        height: "100%",
        fontSize: 14,
        color: "#1e293b",
    },

    registerButton: {
        height: 56,
        backgroundColor: "#2563eb",
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        gap: 12,
        elevation: 4,
    },

    disabledButton: {
        opacity: 0.6,
    },

    registerButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },

    backButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: 22,
        padding: 10,
    },

    backText: {
        color: "#2563eb",
        fontSize: 15,
        fontWeight: "600",
    },

    footer: {
        color: "#94a3b8",
        fontSize: 12,
        marginTop: 30,
        marginBottom: 10,
    },

});