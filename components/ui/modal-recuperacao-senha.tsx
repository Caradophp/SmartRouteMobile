import { styles } from "@/styles/global-style";
import { useState } from "react";
import { Button, Modal, Text, TextInput, View } from "react-native";
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

    const varificarEmailEnviarCodigo = async () => {
        // TODO: Verificar email para enviar código
    }

    const verificarSeCodigoValido = async () => {
        // TODO: Verifica se o código enviado para o email do usuário é válido
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
                                <Button title="Cancelar" onPress={() => setOpen(false)}/>
                                <Button title="Enviar"/>
                            </View>
                        </SafeAreaView>
                    </View>
                </View>
            </View>
        </Modal>
    );
}