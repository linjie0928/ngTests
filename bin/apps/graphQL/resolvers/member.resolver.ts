import { Resolver, Query, Arg, Ctx, Mutation } from 'type-graphql';
import { Inject } from 'typedi';
import { ModelType } from 'typegoose';
import Member from '../entities/member.mongo.ql';
import { SignupInput, LoginInput } from './types/signup.input';

@Resolver(Member)
export class MemberResolver {
	constructor(@Inject('ARTICLE_MODEL') private readonly MemberModel: ModelType<Member>) {}

	@Query((returns) => Member)
	async member(@Arg('id') id: string) {
		return await this.MemberModel.findById(id);
	}

	@Query((returns) => [ Member ])
	async members(): Promise<Member[]> {
		return await this.MemberModel.find({});
	}

	@Mutation((returns) => Member)
	async signup(@Arg('signup') signupInput: SignupInput): Promise<Member> {
		const member = this.MemberModel.findOne({ email: signupInput.email });
		if (!member) {
			const newMember = new this.MemberModel({
				...signupInput
			} as Member);
			return await newMember.save();
		} else {
			throw new Error('使用者已存在');
		}
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
