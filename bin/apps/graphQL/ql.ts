import { UniversalApp } from '../universal';
import * as cors from 'cors';
import * as graphqlHTTP from 'express-graphql';
import { Container, Inject, Service } from 'typedi';
import * as bluebird from 'bluebird';
import * as path from 'path';
import { createConnection, Connection } from 'mongoose';
import { Article } from './entities/article.mongo.ql';
import { ArticleResolver } from './resolvers/article.resolver';
import { TypegooseMiddleware } from './typegoose-middleware';
import { MemberResolver } from './resolvers/member.resolver';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from './object-id.scalar';
import { buildSchema } from 'type-graphql';
import { Member } from './entities/member.mongo.ql';

Container.set('authorization-token', 'RVT9rVjSVN');

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

			Container.set([
				{
					id: 'article.model',
					factory: () => new Article().getModelForClass(Article, { existingConnection: this.mongo })
				},
				{
					id: 'member.model',
					factory: () => new Member().getModelForClass(Member, { existingConnection: this.mongo })
				}
			]);

			const schema = await buildSchema({
				resolvers: [ ArticleResolver, MemberResolver ],
				emitSchemaFile: path.resolve('./', 'schema.gql'),
				globalMiddlewares: [ TypegooseMiddleware ],
				scalarsMap: [ { type: ObjectId, scalar: ObjectIdScalar } ],
				container: Container,
				validate: false
			});

			this.app.use(
				'/api',
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
