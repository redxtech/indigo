// typedefs

// method of web request
export type method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// interface for server entries
export interface Server {
	name: string;
	url: string;
	token: string;
}

// expected type for item from indigo device
export interface IndigoDeviceItem {
	name: string;
	nameURLEncoded: string;
	restURL: string;
	restParent: string;
}
