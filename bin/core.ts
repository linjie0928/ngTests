import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import { Express } from 'express';

import * as express from 'express';

export interface App {
	name?: string;
	app?: Express;
	hostname?: string;
	ssl: boolean;
}

export class App {
	name?: string;
	app?: Express;
	hostname?: string;
	ssl = false;

	constructor(name, hostname, ssl?: boolean) {
		this.app = express();
		this.name = name;
		this.hostname = hostname;
		this.ssl = ssl;
	}
}

export class AppRouter {
	public router: express.Router = express.Router();
}

export class Http {
	public http;

	constructor(app) {
		this.http = http.createServer(app);
	}
}

export class Https {
	public https;
	constructor(ex) {
		this.https = https.createServer(
			{
				cert: fs.readFileSync('/etc/letsencrypt/live/virllage.com/fullchain.pem'),
				key: fs.readFileSync('/etc/letsencrypt/live/virllage.com/privkey.pem')
			},
			ex
		);
	}
}

export class Key {
	public static readonly TOKEN: Key = new Key('GsjeCsYcnR');

	private constructor(public key: string) {}
}
