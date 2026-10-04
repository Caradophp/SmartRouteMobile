import { styles } from "@/styles/global-style";
import { useState } from "react";
import { Alert, Button, Modal, Text, TextInput, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
    open: boolean,
    setOpen: (e: boolean) => void
}

export default function ModalRecuperacaoSenha({ open, setOpen }: Props) {

    const [digitantoSenhaNova, setDigitandoSenhaNova] = useState<boolean>(false);
    const [codigoValido, setCodigoValido] = useState<boolean>(false);
    const [emailCpf, setEmailCpf] = useState<string>('');
    const [senhaNova, setSenhaNova] = useState<string>('');
    const [confirmarSenha, setConfirmarSenha] = useState<string>('');
    const [codigo, setCodigo] = useState<number>(0);

    const verificarEmailEnviarCodigo = async () => {
        try {
            const response = await fetch(`http://192.168.1.121:8080/login/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailCpf
                })
            });

            if (!response.ok) {
                ToastAndroid.show('Erro desconhecido. Contate o suporte técnico', 1000);
                return;
            }

            ToastAndroid.show('E-mail enviado com sucesso. Verificaque sua caixa de entrada', 1000);
            setCodigoValido(true);
        } catch (error) {
            ToastAndroid.show('Erro', 1000);
            throw error;
        }
    }

    const verificarSeCodigoValido = async () => {
        try {
            const response = await fetch(`http://192.168.1.121:8080/login/code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailCpf,
                    codigo: codigo
                })
            });

            if (!response.ok) {
                ToastAndroid.show('Erro desconhecido. Contate o suporte técnico', 1000);
                return;
            }

            ToastAndroid.show('Código válidado com sucesso. Digite sua nova senha', 1000);
            setCodigoValido(false);
            setDigitandoSenhaNova(true)
        } catch (error) {
            ToastAndroid.show('Erro', 1000);
            throw error;
        }
    }

    const trocarSenhaUsuario = async () => {
        try {
            const response = await fetch(`http://192.168.1.121:8080/aplicativo`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailCpf,
                    senha: senhaNova,
                    confirmar_senha: confirmarSenha
                })
            });

            if (!response.ok) {
                ToastAndroid.show('Erro desconhecido. Contate o suporte técnico', 1000);
                return;
            }

            ToastAndroid.show('Senha alterada com sucesso', 1000);
            setOpen(false)
            reset();
        } catch (error) {
            ToastAndroid.show('Erro', 1000);
            throw error;
        }
    }

    const sendHandler = () => {
        if (!codigoValido && !digitantoSenhaNova) {
            verificarEmailEnviarCodigo();
        } else if (codigoValido) {
            verificarSeCodigoValido();
        } else if (digitantoSenhaNova) {
            trocarSenhaUsuario();
        } else {
            Alert.alert('Entre em contato com nosso time de suporte.');
        }
    }

    const reset = () => {
        setCodigoValido(false);
        setDigitandoSenhaNova(false);
        setCodigo(0);
        setEmailCpf('');
        setSenhaNova('');
        setConfirmarSenha('');
    }

    return (
        <Modal visible={open} transparent={true} >
            <View style={[
                styles.container,
                {
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 10,
                }
            ]}>
                <View style={{ backgroundColor: 'white', borderStyle: 'solid', borderColor: 'black', borderWidth: 1, padding: 10 }}>
                    <Text style={{ margin: 25 }}>Recuperação de Senha</Text>
                    <View style={[styles.formContainer]}>
                        <SafeAreaView>
                            {!codigoValido && <TextInput placeholder="Digite seu e-mail ou CPF" style={styles.input} value={emailCpf} onChangeText={(e) => setEmailCpf(e)}/>}
                            {digitantoSenhaNova && <TextInput placeholder="Digite a nova senha" style={styles.input} value={senhaNova} onChangeText={(e) => setSenhaNova(e)}/>}
                            {digitantoSenhaNova && <TextInput placeholder="Confirme a nova senha" style={styles.input} value={confirmarSenha} onChangeText={(e) => setConfirmarSenha(e)}/>}
                            {codigoValido && <TextInput placeholder="Digite o código enviado no e-mail" style={styles.input} value={String(codigo)} onChangeText={(e) => setCodigo(Number(e))}/>}
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 170 }}>
                                <Button title="Cancelar" onPress={() => {setOpen(false), reset()}}/>
                                <Button title="Enviar" onPress={() => sendHandler()}/>
                            </View>
                        </SafeAreaView>
                    </View>
                </View>
            </View>
        </Modal>
    );
}