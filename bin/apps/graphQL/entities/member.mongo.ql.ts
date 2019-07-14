import { prop, Typegoose, ModelType, instanceMethod, InstanceType, staticMethod } from 'typegoose';
import { ObjectType, Field, ID } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { IMember } from './member';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';

enum Level {
	GENERAL = 1,
	ADMIN = 999
}

@ObjectType()
export class Member extends Typegoose implements IMember {
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

	@Field({ nullable: true })
	@prop()
	tocken?: string;

	@instanceMethod
	public saveByHashPassword(this: InstanceType<Member>) {
		this.password = hashSync(this.password, genSaltSync(8));
		return this.save();
	}

	@instanceMethod
	public getToken(this: InstanceType<Member>) {
		this.tocken = sign(
			{
				_id: this._id,
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.email,
				level: this.level
			} as Member,
			'scrite',
			{ expiresIn: '1d' }
		);
		return this;
	}

	@instanceMethod
	public generateHash(this: InstanceType<Member>, password: string) {
		return hashSync(password, genSaltSync(8));
	}

	@instanceMethod
	public validPassword(this: InstanceType<Member>, password: string) {
		return compareSync(password, this.password);
	}
}
