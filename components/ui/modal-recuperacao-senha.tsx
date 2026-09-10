import { styles } from "@/styles/global-style";
import { Button, Modal, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
    open: boolean,
    setOpen: (e: boolean) => void
}

export default function ModalRecuperacaoSenha({ open, setOpen }: Props) {
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
                            <TextInput placeholder="Digite seu e-mail ou CPF" style={styles.input}/>
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