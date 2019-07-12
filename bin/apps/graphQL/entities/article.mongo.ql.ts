import { prop, Typegoose, ModelType } from 'typegoose';
import { IArticle } from './article';
import { ObjectType, Field, ID } from 'type-graphql';
import { ObjectId } from 'mongodb';

@ObjectType()
export class Article extends Typegoose implements IArticle {
	@Field((type) => ID)
	_id: ObjectId;

	@Field({ nullable: true })
	@prop({ trim: true })
	title?: string;

	@Field({ nullable: true })
	@prop({ trim: true })
	paragraph?: string;
}
