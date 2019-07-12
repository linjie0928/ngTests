import 'reflect-metadata';
import { WWW } from './www';
// import handlers from './Handlers';
// import { Express } from 'express';
// import * as express from 'express';
// import * as http from 'http';
// import * as cors from 'cors';
// import * as graphqlHTTP from 'express-graphql';

// import { Container } from 'typedi';
// import { IArticleModel } from './apps/graphQL/schemas/article.mongo';
// import { buildSchema } from 'type-graphql';

// import { GArticleResolver } from './apps/graphQL/schemas/article.graph';
// import { createConnection, Connection } from 'mongoose';

const serv = new WWW();

// class Test {
// 	private masterApp: Express;
// 	private mongo: any;

// 	constructor() {
// 		this.masterApp = express();
// 		const server = http.createServer(this.masterApp);

// 		this.mongo = createConnection('mongodb://ql:H6LeNucV01lf86S4@127.0.0.1:27017/ql', {
// 			useCreateIndex: true,
// 			useNewUrlParser: true,
// 			useFindAndModify: false
// 		});

// 		Container.set({ id: 'ARTICLE_MODEL', factory: () => IArticleModel.getModel(this.mongo) });

// 		buildSchema({
// 			resolvers: [ GArticleResolver ]
// 		})
// 			.then((schema) => {
// 				this.masterApp.use(
// 					'/graphql',
// 					cors(),
// 					graphqlHTTP({
// 						schema,
// 						rootValue: global,
// 						graphiql: true
// 					})
// 				);
// 				server.listen(8080).on('listening', handlers.onListeningHttps(server)).on('error', handlers.onError);
// 			})
// 			.catch((err) => {
// 				console.error(err);
// 			});
// 	}
// }

// const serv = new Test();
