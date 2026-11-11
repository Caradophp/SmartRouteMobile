import { BASE_IP } from "@/constants/Util";
import { Alert } from "react-native";
import { useEffect } from "react";
import { Client } from "@stomp/stompjs";

export function useWebSocket() {
    useEffect(() => {
        const client = new Client({
            brokerURL: `ws://${BASE_IP}:8080/ws`,

            reconnectDelay: 5000,

            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            onConnect: () => {
                console.log("STOMP connected");

                client.subscribe("/topic/ambulancias", (message) => {
                    const emergency = JSON.parse(message.body);

                    console.log("Emergency received:", emergency);

                    Alert.alert(
                        "Emergency!",
                        "A new ambulance request was received."
                    );
                });
            },

            onStompError: (frame) => {
                console.error("STOMP error:", frame.headers["message"]);
                console.error(frame.body);
            },

            onWebSocketError: (error) => {
                console.error("WebSocket error:", error);
            },

            onWebSocketClose: () => {
                console.log("WebSocket disconnected");
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);
}
