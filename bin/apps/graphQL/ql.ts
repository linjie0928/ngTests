// import 'reflect-metadata';
import { UniversalApp } from '../universal';
import * as cors from 'cors';
import * as graphqlHTTP from 'express-graphql';
import { Container } from 'typedi';
import * as bluebird from 'bluebird';
import { createConnection, Connection } from 'mongoose';
import { buildSchema } from 'type-graphql';
import { Article } from './entities/article.mongo.ql';
import { ArticleResolver } from './resolvers/article.resolver';
import { TypegooseMiddleware } from './typegoose-middleware';
import { MemberResolver } from './resolvers/member.resolver';

export class QLApp extends UniversalApp {
	/* DataBase Connection */
	private mongo: Connection;

	constructor(name: string, hostname: string, ssl: boolean) {
		super(name, hostname, ssl);
		this.bootstrap();
	}

	async bootstrap() {
		try {
			this.mongo = await createConnection('mongodb://ql:H6LeNucV01lf86S4@127.0.0.1:27017/ql', {
				useCreateIndex: true,
				useNewUrlParser: true,
				useFindAndModify: false
			});

			Container.set({
				id: 'ARTICLE_MODEL',
				factory: () => new Article().getModelForClass(Article, { existingConnection: this.mongo })
			});

			const schema = await buildSchema({
				resolvers: [ ArticleResolver, MemberResolver ],
				globalMiddlewares: [ TypegooseMiddleware ]
			});

			this.app.use(
				'/graphql',
				cors(),
				graphqlHTTP({
					schema,
					rootValue: global,
					graphiql: true
				})
			);

			this.universalStartUp();
		} catch (err) {
			console.error(err);
		}
	}
}
