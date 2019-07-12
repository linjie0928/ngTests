import { prop, Typegoose, ModelType, instanceMethod } from 'typegoose';
import { ObjectType, Field, ID } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { IMember } from './member';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

enum Level {
	GENERAL = 1,
	ADMIN = 999
}

@ObjectType()
export default class Member extends Typegoose implements IMember {
	@Field((type) => ID)
	_id: ObjectId;

	@Field()
	@prop({ trim: true })
	firstName: string;

	@Field()
	@prop({ trim: true })
	lastName: string;

	@Field()
	@prop()
	password: string;

	@Field()
	@prop({ unique: true })
	email: string;

	@Field()
	@prop({ default: Date.now })
	createTime: Date;

	@Field()
	@prop({ default: 1, enum: Level })
	level: number;

	@instanceMethod
	public generateHash(this: InstanceType<ModelType<Member>>, password: string) {
		return hashSync(password, genSaltSync(8));
	}

	@instanceMethod
	public validPassword(this: InstanceType<ModelType<Member>>, password: string) {
		return compareSync(password, this.password);
	}
}
