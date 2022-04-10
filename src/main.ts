import { parse } from 'std/flags/mod.ts';
import { logErr } from './utils.ts';
import {
	listDevices,
	showStatus,
	toggle,
	turnOff,
	turnOn,
} from './commands.ts';

// import types
import { Server } from './type.ts';

// read server configurations from json file
const { servers }: { servers: Server[] } = JSON.parse(
	Deno.readTextFileSync('./indigo_config.json'),
);

// main script
const main = (): void => {
	// make sure the args are passed
	const args = parse(Deno.args);
	if (args._.length < 2) {
		logErr('you need to specify a server & subcommand');
		Deno.exit(1);
	}

	// grab the subcommand & server
	const subcommand = args._[0];
	const serverName = args._[1];

	// validate the server
	const server = servers.find((s: Server) => s.name === serverName);
	if (!server) {
		logErr(`the server '${serverName}' doesn't exist`);
		Deno.exit(1);
	}

	// run the subcommand
	switch (subcommand) {
		case 'list': {
			// list available devices
			listDevices(server);
			break;
		}
		case 'status': {
			// show the status of a device
			const device = args._.slice(2).join(' ');
			if (!device) {
				logErr('you need to specify a device');
				Deno.exit(1);
			}
			showStatus(server, device.toString());
			break;
		}
		case 'on': {
			// turn a device on
			const device = args._.slice(2).join(' ');
			if (!device) {
				logErr('you need to specify a device');
				Deno.exit(1);
			}
			turnOn(server, device.toString());
			break;
		}
		case 'off': {
			// turn a device on
			const device = args._.slice(2).join(' ');
			if (!device) {
				logErr('you need to specify a device');
				Deno.exit(1);
			}
			turnOff(server, device.toString());
			break;
		}
		case 'toggle': {
			// toggle a device
			const device = args._.slice(2).join(' ');
			if (!device) {
				logErr('you need to specify a device');
				Deno.exit(1);
			}
			toggle(server, device.toString());
			break;
		}
		default: {
			logErr(`the subcommand '${subcommand}' doesn't exist`);
			Deno.exit(1);
		}
	}
};

main();
