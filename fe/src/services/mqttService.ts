/**
 * services/mqttService.ts
 * Optional MQTT WebSocket client for real-time ESP32 sensor telemetry.
 * Subscribe to broker topics to get live smoke/temp/CO2 readings on HomeScreen.
 *
 * Install: npm install paho-mqtt (already in package.json)
 *
 * Topics (align with hardware team's firmware):
 *   fire-alarm/devices/{deviceId}/sensors    <- sensor telemetry
 *   fire-alarm/devices/{deviceId}/status     <- ONLINE/OFFLINE heartbeat
 *   fire-alarm/alerts/{deviceId}             <- real-time alert events
 */

// import Paho from 'paho-mqtt';

type MessageHandler = (topic: string, payload: string) => void;

class MqttService {
  // private client: Paho.Client | null = null;

  connect(brokerUrl: string, onMessage: MessageHandler): void {
    // const [host, portStr] = brokerUrl.replace('ws://', '').split(':');
    // this.client = new Paho.Client(host, parseInt(portStr), `fire-alarm-app-${Date.now()}`);
    // this.client.onMessageArrived = (msg) => onMessage(msg.destinationName, msg.payloadString);
    // this.client.connect({ onSuccess: () => this.subscribeAll() });
    console.log('[MQTT] connect — TODO: uncomment Paho implementation');
  }

  private subscribeAll(): void {
    // this.client?.subscribe('fire-alarm/#');
  }

  publish(topic: string, payload: string): void {
    // const msg = new Paho.Message(payload);
    // msg.destinationName = topic;
    // this.client?.send(msg);
    console.log('[MQTT] publish', topic, payload);
  }

  disconnect(): void {
    // this.client?.disconnect();
    console.log('[MQTT] disconnect');
  }
}

export const mqttService = new MqttService();
