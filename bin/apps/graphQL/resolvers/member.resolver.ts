import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { ModelType } from 'typegoose';
import { Member } from '../entities/member.mongo.ql';
import { SignupInput, LoginInput } from './types/signup.input';
import { sign } from 'jsonwebtoken';

@Service()
@Resolver(Member)
export class MemberResolver {
	constructor(@Inject('member.model') private readonly MemberModel: ModelType<Member>) {}

	@Query((returns) => Member)
	async member(@Arg('id') id: string) {
		return await this.MemberModel.findById(id);
	}

	@Query((returns) => [ Member ])
	async members(): Promise<Member[]> {
		return await this.MemberModel.find({});
	}

	@Mutation((returns) => Member)
	async signup(@Arg('form') signupInput: SignupInput): Promise<Member> {
		const member = await this.MemberModel.findOne({ email: signupInput.email });

		if (!member) {
			const newMember = new this.MemberModel({
				...signupInput
			} as Member);
			const savedMember = await newMember.saveByHashPassword();
			return savedMember.getToken();
		} else if (member.validPassword(signupInput.password)) return member.getToken();
		else throw new Error('使用者已存在');
	}

	@Mutation((returns) => Member)
	async login(@Arg('login') loginInput: LoginInput): Promise<Member> {
		const member = this.MemberModel.findOne({ email: loginInput.email });
		if (!member) {
			throw new Error('找不到使用者');
		}

		return await member;
	}
}
