import { connect } from 'mqtt';
import { connected } from 'process';
import { useState } from 'react';
import { createContext } from 'react';
var mqtt = require('mqtt');


const broker = window._env_.REACT_APP_MqttBroker;

let MQTT = (() => {
	let client: any = mqtt.connect(broker);
	// set callback handlers
	// client.onConnectionLost = onConnectionLost;
	client.on('message', onMessage);

	// Override with custom callback function if desired.
	function connect(callback = onConnect) {
		// connect the client
		if (!client) {
			client = mqtt.connect(broker);
		}
		callback();
	}

	// called when the client connects
	function onConnect() {
		// Once a connection has been made, make a subscription and send a message.
		console.log('[MQTT] Connected to Broker');
	}

	function unSubscribe(topic: string[] | string) {
		console.log(`[MQTT] Unscubscribe to ${topic}`);
		client.unsubscribe(topic);
	}

	function subscribe(topic: string[] | string) {
		client.subscribe(topic);
		console.log(`[MQTT] Subscribed to ${topic}`);
	}

	// // called when the client loses its connection
	// function onConnectionLost(responseObject) {
	// 	if (responseObject.errorCode !== 0) {
	// 		console.warn('[MQTT] onConnectionLost:' + responseObject.errorMessage);
	// 	}
	// }

	// called when a message arrives
	function onMessage(topic: string, message: string) {
		console.log(`[MQTT] Message from broker: [${message}] : ${topic}`);
	}

	function publish(message: string, topic: string) {
		console.log(`[MQTT] Message send to broker: [${topic}] : ${message}`);
		client.publish(topic, message);
	}

	return {
		client: client,
		connect: connect,
		subscribe: subscribe,
		unsubscribe: unSubscribe,
		onMessage: onMessage,
		publish: publish,
	};
})();

export default MQTT;
