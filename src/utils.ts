// utility functions

import { red } from 'std/fmt/colors.ts';

import { Server } from './type.ts';

// error log
export const logErr = (str: string) =>
	console.error(`${red('[error] ' + str)}`);

// convert an object into a url string
export const encodePayload = (payload: Record<string, unknown>): string => {
	return Object.entries(payload).map((e) => `${e[0]}=${e[1]}`).join('&');
};

// send the request to the server
export const apiGet = async (
	server: Server,
	path: string,
): Promise<unknown> => {
	// send the request with the auth header
	const response = await fetch(
		new Request(server.url + path, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + server.token,
			},
		}),
	);

	// make sure the request goes through properly
	if (response.status === 200) {
		return await response.json();
	} else {
		throw new Error(`[GET]${path} failed (${response.status})`);
	}
};

export const apiPut = async (
	server: Server,
	path: string,
	payload: Record<string, unknown>,
): Promise<unknown> => {
	const response = await fetch(
		new Request(server.url + path, {
			method: 'PUT',
			body: encodePayload(payload),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Bearer ' + server.token,
			},
		}),
	);

	if (response.status === 200) {
		return { ...await response.json(), ...payload };
	} else {
		throw new Error(`[PUT]${path} failed (${response.status})`);
	}
};
