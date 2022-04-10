// commands that are available to be run

import { logErr } from './utils.ts';
import { getDevices, getStatus, updateDevice } from './api.ts';

import { IndigoDeviceItem, Server } from './type.ts';

// list devices
export const listDevices = async (server: Server): Promise<void> => {
	try {
		// grab the devices, filter out uneccessary fields, & print them out
		const devices = await getDevices(server);
		console.log(devices.map((d: IndigoDeviceItem) => {
			return { name: d.name, url: d.restURL };
		}));
	} catch (err) {
		logErr(`couldn't fetch ${server.name} device list: ${err.message}`);
	}
};

// show status for a device
export const showStatus = async (
	server: Server,
	device: string,
): Promise<void> => {
	try {
		console.log(await getStatus(server, device));
	} catch (err) {
		logErr(
			`couldn't fetch ${server.name}/${device} status: ${err.message}`,
		);
	}
};

// turn a device on
export const turnOn = async (server: Server, device: string): Promise<void> => {
	try {
		const thing = await updateDevice(server, device, { isOn: true });
		console.log(thing);
	} catch (err) {
		logErr(
			`couldn't turn ${server.name}/${device} on: ${err.message}`,
		);
	}
};

// turn a device off
export const turnOff = async (
	server: Server,
	device: string,
): Promise<void> => {
	try {
		const thing = await updateDevice(server, device, { isOn: false });
		console.log(thing);
	} catch (err) {
		logErr(
			`couldn't turn ${server.name}/${device} off: ${err.message}`,
		);
	}
};

// toggle a device
export const toggle = async (
	server: Server,
	device: string,
): Promise<void> => {
	try {
		const status = await getStatus(server, device);
		const updateFunc = status.isOn ? turnOff : turnOn;
		// updateFunc(server, device);
		updateFunc(server, device);
	} catch (err) {
		logErr(
			`couldn't toggle ${server.name}/${device}: ${err.message}`,
		);
	}
};
