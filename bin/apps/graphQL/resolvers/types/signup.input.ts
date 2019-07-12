import { InputType, Field } from 'type-graphql';
import Member from '../../entities/member.mongo.ql';

@InputType()
export class SignupInput implements Partial<Member> {
	@Field() email: string;
	@Field() password: string;
	@Field() firstName: string;
	@Field() lastName: string;
}

@InputType()
export class LoginInput implements Partial<Member> {
	@Field() email: string;
	@Field() password: string;
}
