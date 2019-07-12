import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as express from 'express';
import { Express, Router } from 'express';
import { App } from '../core';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import { enableProdMode } from '@angular/core';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
// import * as helmet from 'helmet';

enableProdMode();

export interface UniversalApp {
	apiRouterBuilder?(): Router;
}

export abstract class UniversalApp extends App {
	DIST_FOLDER = join(process.cwd(), `dist/${this.name}/browser`);
	constructor(name: string, hostname: string, ssl: boolean) {
		super(name, hostname, ssl);

		const {
			AppServerModuleNgFactory,
			LAZY_MODULE_MAP,
			ngExpressEngine,
			provideModuleMap
		} = require(`../../dist/${this.name}/server/main`);

		// this.app.use(helmet());
		this.app.use(compression());
		this.app.use(cookieParser());
		this.app.use(cors());
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));

		this.app.engine(
			'html',
			ngExpressEngine({
				bootstrap: AppServerModuleNgFactory,
				providers: [ provideModuleMap(LAZY_MODULE_MAP) ]
			})
		);

		this.app.set('view engine', 'html');
		this.app.set('views', this.DIST_FOLDER);
	}

	universalStartUp() {
		// Example Express Rest API endpoints
		// app.get('/api/**', (req, res) => { });
		// Serve static files from /browser
		this.app.get(
			'*.*',
			express.static(this.DIST_FOLDER, {
				maxAge: '1y'
			})
		);

		// All regular routes use the Universal engine
		this.app.get('*', (req, res) => {
			res.render('index', { req });
		});
	}
}

export class SimpleUniversalApp extends UniversalApp {
	constructor(name: string, hostname: string, ssl: boolean) {
		super(name, hostname, ssl);
		// this.app.use('/api', this.apiRouterBuilder());

		this.universalStartUp();
	}
}
