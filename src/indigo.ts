#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read --lib es2021

import { config as dotEnvConfig } from 'dotenv/mod.ts';
// import { red } from "fmt/colors.ts"

const env = dotEnvConfig({
	path: `${Deno.env.get('HOME')}/.local/dotfiles/secrets.sh`,
});

// typedefs
// type method = 'GET' | 'POST' | 'PUT' | 'DELETE'
interface Server {
	name: string;
	url: string;
	token: string;
}

// server globals
const servers: Server[] = [
	{
		name: 'cgy',
		url: 'https://dunn-calgary.indigodomo.net/',
		token: env.INDIGO_TOKEN_CGY,
	},
	{
		name: 'cnm',
		url: 'https://dunn-canmore.indigodomo.net/',
		token: env.INDIGO_TOKEN_CNM,
	},
];

// send the request to the server
// const sendReq = (server: server, device: string, method: method) => {
//   console
// }

// function to check the status of a device
const status = (server: Server, device: string) => {
	console.log(`${server.name}: ${server.url} - ${device}`);
	// const req = await
};

// main script
const main = () => {
	// make sure the args are passed
	const args = Deno.args;
	if (args.length < 2) {
		console.error('you need to specify a server & subcommand');
		Deno.exit(1);
	}

	// grab the subcommand & server
	const subcommand = args[0];
	const serverName = args[1];

	// validate the server
	const server = servers.find((s: Server) => s.name === serverName);
	if (!server) {
		console.error(`the server '${serverName}' doesn't exist`);
		Deno.exit(1);
	}

	// run the subcommand
	switch (subcommand) {
		case 'status': {
			const device = args[2];
			if (!device) {
				console.error('you need to specify a device');
				Deno.exit(1);
			}
			console.log('checking status...');
			status(server, device);
			break;
		}
		case 'update': {
			console.log('updating device');
			break;
		}
		default: {
			console.error(`the subcommand '${subcommand}' doesn't exist`);
			Deno.exit(1);
		}
	}
};

main();
