import handlers from './Handlers';
import * as https from 'https';
import * as http from 'http';
import * as vhost from 'vhost';
import { Express } from 'express';
import * as express from 'express';
import * as fs from 'fs';
import { App } from './core';
import { QLApp } from './apps/graphQL/ql';

export class WWW {
	/* master app */
	private masterApp: Express;

	/* app list */
	private Apps: App[];

	/* Servers */
	private HTTPSSer: https.Server;
	private HTTPSer: http.Server;

	private static startHttpOrHttpsListening = (server: any, port: number) => {
		server.listen(port).on('listening', handlers.onListeningHttps(server)).on('error', handlers.onError);
	};

	constructor() {
		this.masterApp = express();

		this.Apps = [ new QLApp('graphQL', 'graphql.virllage.com', false) ];

		let isSSLLoaded = false; // after ssl loaded chage to TRUE;

		this.masterApp.use('*', (req, res, next) => {
			const hostname = req.hostname;
			const isSSL = /^https$/.test(req.protocol) ? true : /^http$/.test(req.protocol) ? false : null;
			const app = this.Apps.find((_app) => _app.hostname === hostname);

			if (app && isSSLLoaded) {
				if (app.ssl !== isSSL) {
					res.redirect(
						301,
						app.ssl ? `https://${hostname}${req.baseUrl}` : `http://${hostname}${req.baseUrl}`
					);
				} else {
					next();
				}
			} else {
				next();
			}
		});

		this.Apps.forEach((app) => this.masterApp.use(vhost(app.hostname, app.app)));

		try {
			this.HTTPSSer = https.createServer(
				{
					cert: fs.readFileSync('/etc/letsencrypt/live/virllage.com/fullchain.pem'),
					key: fs.readFileSync('/etc/letsencrypt/live/virllage.com/privkey.pem')
				},
				this.masterApp
			);

			WWW.startHttpOrHttpsListening(this.HTTPSSer, 4433);
			isSSLLoaded = true;
		} catch (err) {
			console.log('no ssl key');
		}

		this.HTTPSer = http.createServer(this.masterApp);
		WWW.startHttpOrHttpsListening(this.HTTPSer, 8080);
	}
}
