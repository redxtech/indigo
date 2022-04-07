#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read --lib es2021

import { config as dotEnvConfig } from 'dotenv/mod.ts'
import { parse } from 'std/flags/mod.ts'
import { red } from "std/fmt/colors.ts"
// import { get, OK } from 'kall/mod.ts'

const env = dotEnvConfig({
	path: `${Deno.env.get('HOME')}/.local/dotfiles/secrets.sh`,
})

// typedefs
type method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
interface Server {
	name: string
	url: string
	token: string
}
interface IndigoDeviceItem {
	name: string
	restURL: string
}

// server globals
const servers: Server[] = [
	{
		name: 'cgy',
		url: 'https://dunn-calgary.indigodomo.net',
		token: env.INDIGO_TOKEN_CGY,
	},
	{
		name: 'cnm',
		url: 'https://dunn-canmore.indigodomo.net',
		token: env.INDIGO_TOKEN_CNM,
	},
]

const logErr = (str: string) => console.error(`${red('[error] ' + str)}`)

// send the request to the server
const sendReq = async (server: Server, path: string, method: method = 'GET') => {
	// send the request with the auth header
	const response = await fetch(new Request(server.url + path, {
		method,
		headers: { Authorization: 'Bearer ' + server.token }
	}))

	// make sure the request goes through properly
	if (response.status === 200) {
		return await response.json()
	} else {
		throw new Error(`[${method}]${path} failed (${response.status})`)
	}
}

// list devices
const listDevices = async (server: Server) => {
	try {
		const devices = await sendReq(server, '/devices.json')
		console.log(devices.map((d: IndigoDeviceItem) => { return { name: d.name, url: d.restURL }}))
	} catch (err) {
		logErr('couldn\'t fetch ' + server.name + ' device list: ' + err.message)
	}
}

// function to check the status of a device
const getStatus = async (server: Server, device: string) => {
	try {
		const path = '/devices/' + encodeURI(device) + '.json'
		const status = await sendReq(server, path)
		console.log(status)
	} catch (err) {
		logErr('couldn\'t fetch ' + server.name + ' device status: ' + err.message)
	}
}

// main script
const main = () => {
	// make sure the args are passed
	const args = parse(Deno.args)
	if (args._.length < 2) {
		console.error('you need to specify a server & subcommand')
		Deno.exit(1)
	}

	// grab the subcommand & server
	const subcommand = args._[0]
	const serverName = args._[1]

	// validate the server
	const server = servers.find((s: Server) => s.name === serverName)
	if (!server) {
		console.error(`the server '${serverName}' doesn't exist`)
		Deno.exit(1)
	}

	// run the subcommand
	switch (subcommand) {
		case 'list': {
			listDevices(server)
			break
		}
		case 'status': {
			const device = args._.slice(2).join(' ')
			if (!device) {
				console.error('you need to specify a device')
				Deno.exit(1)
			}
			getStatus(server, device.toString())
			break
		}
		case 'update': {
			console.log('updating device')
			break
		}
		default: {
			console.error(`the subcommand '${subcommand}' doesn't exist`)
			Deno.exit(1)
		}
	}
}

main()

