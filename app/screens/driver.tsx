import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';

export default function InitialScreen() {
    const [reportOpen, setReportOpen] = useState(false);
    const [problem, setProblem] = useState('');
    const [reportSent, setReportSent] = useState(false);
    const [emergencyAccepted, setEmergencyAccepted] = useState(false);

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.eyebrow}>SMARTROUTE • MOTORISTA</Text>
                <Text style={styles.title}>Olá, motorista</Text>
                <Text style={styles.subtitle}>Pronto para atender?</Text>

                <View style={styles.statusRow}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Ambulância disponível</Text>
                </View>

                {!emergencyAccepted ? (
                    <View style={styles.card}>
                        <Text style={styles.alertLabel}>NOVA EMERGÊNCIA</Text>
                        <Text style={styles.cardTitle}>Atendimento solicitado</Text>
                        <Text style={styles.detail}>📍 Rua das Palmeiras, 240</Text>
                        <Text style={styles.detail}>🚑 3,2 km • cerca de 8 min</Text>
                        <Pressable style={styles.primaryButton} onPress={() => setEmergencyAccepted(true)}>
                            <Text style={styles.primaryButtonText}>Aceitar emergência</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <View style={styles.routeHeader}>
                            <View>
                                <Text style={styles.statusText}>EMERGÊNCIA ACEITA</Text>
                                <Text style={styles.cardTitle}>Siga para o local</Text>
                            </View>
                            <Text style={styles.eta}>8 min</Text>
                        </View>
                        <Text style={styles.detail}>Rua das Palmeiras, 240</Text>
                        <View style={styles.map}>
                            <View style={[styles.road, styles.roadOne]} />
                            <View style={[styles.road, styles.roadTwo]} />
                            <View style={[styles.road, styles.roadThree]} />
                            <View style={styles.routeLine} />
                            <View style={styles.startMarker}><Text>🚑</Text></View>
                            <View style={styles.destinationMarker}><Text style={styles.destinationText}>+</Text></View>
                        </View>
                        <Text style={styles.mapCaption}>Ambulância  ───  Local da emergência</Text>
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Problema no veículo?</Text>
                    <Text style={styles.detail}>Avise a equipe sobre qualquer falha na ambulância.</Text>
                    {!reportOpen ? (
                        <Pressable style={styles.outlineButton} onPress={() => { setReportOpen(true); setReportSent(false); }}>
                            <Text style={styles.outlineButtonText}>Relatar problema</Text>
                        </Pressable>
                    ) : (
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="Descreva o problema..."
                                placeholderTextColor="#8793A1"
                                value={problem}
                                onChangeText={setProblem}
                                multiline
                            />
                            <Pressable
                                style={[styles.primaryButton, !problem.trim() && styles.disabledButton]}
                                disabled={!problem.trim()}
                                onPress={() => { setReportSent(true); setReportOpen(false); setProblem(''); }}
                            >
                                <Text style={styles.primaryButtonText}>Enviar relato</Text>
                            </Pressable>
                        </View>
                    )}
                    {reportSent && <Text style={styles.successText}>Relato enviado. Obrigado por avisar!</Text>}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F6FA',
    },
    content: {
        padding: 22,
        paddingTop: 32,
        paddingBottom: 40,
    },
    eyebrow: {
        color: '#526477',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.2,
    },
    title: {
        color: '#172B42',
        fontSize: 30,
        fontWeight: '800',
        marginTop: 8,
    },
    subtitle: {
        color: '#647487',
        fontSize: 16,
        marginTop: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 20,
    },
    statusDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#20A66A',
        marginRight: 8,
    },
    statusText: {
        color: '#218054',
        fontSize: 13,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        marginBottom: 18,
        elevation: 2,
    },
    alertLabel: {
        color: '#D74348',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
    },
    cardTitle: {
        color: '#172B42',
        fontSize: 19,
        fontWeight: '700',
        marginTop: 7,
        marginBottom: 12,
    },
    detail: {
        color: '#526477',
        fontSize: 14,
        marginBottom: 7,
    },
    primaryButton: {
        backgroundColor: '#D93F45',
        borderRadius: 11,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    disabledButton: {
        opacity: 0.5,
    },
    routeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    eta: {
        color: '#187B57',
        backgroundColor: '#E4F5EC',
        overflow: 'hidden',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontSize: 14,
        fontWeight: '700',
    },
    map: {
        height: 190,
        backgroundColor: '#E8F0E9',
        borderRadius: 13,
        marginTop: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    road: {
        position: 'absolute',
        height: 13,
        width: '125%',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#D5DFD7',
    },
    roadOne: { top: 42, left: -20, transform: [{ rotate: '18deg' }] },
    roadTwo: { top: 112, left: -18, transform: [{ rotate: '-22deg' }] },
    roadThree: { top: 82, left: 30, transform: [{ rotate: '72deg' }] },
    routeLine: {
        position: 'absolute',
        width: 150,
        height: 5,
        left: '28%',
        top: '51%',
        backgroundColor: '#2589E8',
        borderRadius: 3,
        transform: [{ rotate: '-32deg' }],
    },
    startMarker: {
        position: 'absolute',
        left: '18%',
        top: '61%',
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    destinationMarker: {
        position: 'absolute',
        right: '16%',
        top: '24%',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#D93F45',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    destinationText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
    mapCaption: {
        color: '#647487',
        fontSize: 11,
        marginTop: 9,
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: '#D93F45',
        borderRadius: 11,
        minHeight: 46,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    outlineButtonText: {
        color: '#C83239',
        fontSize: 14,
        fontWeight: '700',
    },
    input: {
        minHeight: 90,
        borderWidth: 1,
        borderColor: '#D9E1E9',
        borderRadius: 10,
        padding: 12,
        color: '#172B42',
        textAlignVertical: 'top',
        fontSize: 14,
    },
    successText: {
        color: '#218054',
        fontSize: 13,
        marginTop: 12,
        fontWeight: '600',
    },
});
