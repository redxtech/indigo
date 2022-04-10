// functions that interact with the api

import { apiGet, apiPut } from './utils.ts';

import { IndigoDeviceItem, Server } from './type.ts';

// function to get list of devices
export const getDevices = (server: Server): Promise<IndigoDeviceItem[]> => {
	return apiGet(server, '/devices.json') as Promise<IndigoDeviceItem[]>;
};

// function to check the status of a device
export const getStatus = (
	server: Server,
	device: string,
): Promise<Record<string, unknown>> => {
	const path = '/devices/' + encodeURI(device) + '.json';
	return (apiGet(server, path) as Promise<Record<string, unknown>>);
};

// export const updateDevice = (server: Server, device: string, payload: Record<string, unknown>): Promise<unknown> => {
export const updateDevice = (
	server: Server,
	device: string,
	payload: Record<string, unknown>,
): Promise<unknown> => {
	const path = '/devices/' + encodeURI(device) + '.json';
	return apiPut(server, path, payload);
};
