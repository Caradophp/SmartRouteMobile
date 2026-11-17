import {
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    ToastAndroid,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Image,
} from "react-native";

import { ThemedView } from "../themed-view";
import ModalRecuperacaoSenha from "./modal-recuperacao-senha";

import { useContext, useState } from "react";
import { useRouter } from "expo-router";

import { AppContext } from "@/context/AppContext";
import { API_URL } from "@/constants/Util";

import { Ionicons } from "@expo/vector-icons";

interface LoginFormProps {
    onBack: () => void;
}

export default function LoginForm({ onBack }: LoginFormProps) {

    const [recuperacao, setRecuperacao] = useState(false);

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const context = useContext(AppContext);

    // -----------------------------------------
    // LOGIN
    // -----------------------------------------

    const login = async () => {

        if (!email.trim() || !senha.trim()) {
            ToastAndroid.show(
                "Informe seu e-mail e senha.",
                ToastAndroid.SHORT
            );
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(`${API_URL}/login`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    email: email.trim(),
                    senha: senha,
                    isAplicativo: true,
                }),
            });

            const data = await response.json();

            if (!response.ok) {

                ToastAndroid.show(
                    data?.aviso ?? "Erro ao realizar login.",
                    ToastAndroid.LONG
                );

                return;
            }

            context.setToken(data.token);

            if (data.role === "DRIVER") {
                router.replace("/screens/driver");
            } else {
                router.replace("/screens/home");
            }

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            ToastAndroid.show(
                "Não foi possível conectar ao servidor.",
                ToastAndroid.LONG
            );

        } finally {
            setLoading(false);
        }
    };

    const image = require('@/assets/images/logo2.png');

    // -----------------------------------------
    // RENDER
    // -----------------------------------------

    return (

        <ThemedView style={styles.container}>

            <StatusBar
                backgroundColor="#102A56"
                barStyle="light-content"
            />

            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* HEADER */}

                    <View style={styles.header}>

                        <View style={styles.logoContainer}>
                            <Image source={image} style={{ width: 200, height: 200 }} />
                        </View>
                    </View>

                    {/* LOGIN CARD */}

                    <View style={styles.card}>

                        <Text style={styles.welcome}>
                            Bem-vindo!
                        </Text>

                        <Text style={styles.description}>
                            Entre com suas credenciais para continuar.
                        </Text>

                        {/* EMAIL */}

                        <Text style={styles.label}>
                            E-mail
                        </Text>

                        <View style={styles.inputContainer}>

                            <Ionicons
                                name="mail-outline"
                                size={21}
                                color="#64748B"
                            />

                            <TextInput
                                placeholder="Digite seu e-mail"
                                placeholderTextColor="#94A3B8"
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={setEmail}
                            />

                        </View>

                        {/* PASSWORD */}

                        <Text style={styles.label}>
                            Senha
                        </Text>

                        <View style={styles.inputContainer}>

                            <Ionicons
                                name="lock-closed-outline"
                                size={21}
                                color="#64748B"
                            />

                            <TextInput
                                placeholder="Digite sua senha"
                                placeholderTextColor="#94A3B8"
                                style={styles.input}
                                secureTextEntry={!showPassword}
                                value={senha}
                                onChangeText={setSenha}
                                onSubmitEditing={login}
                                returnKeyType="go"
                            />

                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={
                                        showPassword
                                            ? "eye-off-outline"
                                            : "eye-outline"
                                    }
                                    size={21}
                                    color="#64748B"
                                />
                            </TouchableOpacity>

                        </View>

                        {/* FORGOT PASSWORD */}

                        <TouchableOpacity
                            style={styles.forgotButton}
                            onPress={() => setRecuperacao(true)}
                        >
                            <Text style={styles.forgotText}>
                                Esqueceu sua senha?
                            </Text>
                        </TouchableOpacity>

                        {/* LOGIN BUTTON */}

                        <TouchableOpacity
                            style={[
                                styles.loginButton,
                                loading && styles.disabledButton,
                            ]}
                            onPress={login}
                            disabled={loading}
                            activeOpacity={0.8}
                        >

                            {loading ? (

                                <ActivityIndicator
                                    color="#FFFFFF"
                                    size="small"
                                />

                            ) : (

                                <>
                                    <Text style={styles.loginButtonText}>
                                        Acessar minha conta
                                    </Text>

                                    <Ionicons
                                        name="arrow-forward"
                                        size={21}
                                        color="#FFFFFF"
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
                                color="#475569"
                            />

                            <Text style={styles.backText}>
                                Voltar
                            </Text>

                        </TouchableOpacity>

                    </View>

                    {/* FOOTER */}

                    <View style={styles.footer}>

                        <Ionicons
                            name="shield-checkmark-outline"
                            size={17}
                            color="#CBD5E1"
                        />

                        <Text style={styles.footerText}>
                            Sua saúde e segurança são importantes.
                        </Text>

                    </View>

                </ScrollView>

            </KeyboardAvoidingView>

            {/* PASSWORD RECOVERY MODAL */}

            <ModalRecuperacaoSenha
                open={recuperacao}
                setOpen={setRecuperacao}
            />

        </ThemedView>
    );
}

// -----------------------------------------
// STYLES
// -----------------------------------------

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    keyboardContainer: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 35,
    },

    // HEADER

    header: {
        alignItems: "center",
        marginBottom: 30,
    },

    logoContainer: {
        width: 78,
        height: 78,
        borderRadius: 25,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        elevation: 8,
    },

    appName: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#2563EB",
        letterSpacing: 1,
    },

    subtitle: {
        color: "#CBD5E1",
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
    },

    // CARD

    card: {
        backgroundColor: "#2563EB",
        borderRadius: 24,
        padding: 25,
        elevation: 10,
    },

    welcome: {
        fontSize: 27,
        fontWeight: "bold",
        color: "#102A56",
    },

    description: {
        fontSize: 14,
        color: "#64748B",
        marginTop: 7,
        marginBottom: 25,
    },

    // INPUTS

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#334155",
        marginBottom: 9,
        marginTop: 12,
    },

    inputContainer: {
        height: 56,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 13,
        backgroundColor: "#F8FAFC",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
    },

    input: {
        flex: 1,
        height: "100%",
        paddingHorizontal: 12,
        color: "#1E293B",
        fontSize: 14,
    },

    // FORGOT PASSWORD

    forgotButton: {
        alignSelf: "flex-end",
        marginTop: 15,
        marginBottom: 22,
    },

    forgotText: {
        color: "#2563EB",
        fontWeight: "600",
        fontSize: 13,
    },

    // LOGIN BUTTON

    loginButton: {
        height: 56,
        backgroundColor: "#2563EB",
        borderRadius: 13,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        elevation: 4,
    },

    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    disabledButton: {
        opacity: 0.7,
    },

    // BACK BUTTON

    backButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: 24,
    },

    backText: {
        color: "#475569",
        fontSize: 14,
        fontWeight: "600",
    },

    // FOOTER

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: 30,
    },

    footerText: {
        color: "#CBD5E1",
        fontSize: 12,
    },

});
