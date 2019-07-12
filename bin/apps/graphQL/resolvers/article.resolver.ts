import { IArticle } from '../entities/article';
import { ObjectType, Field, ID, Resolver, Query, Arg, Ctx, Mutation } from 'type-graphql';
import { Inject } from 'typedi';
import { ModelType } from 'typegoose';
import { Article } from '../entities/article.mongo.ql';
// const articleType = new GraphQLObjectType({
// 	name: 'article'
// })
@Resolver(Article)
export class ArticleResolver {
	constructor(@Inject('ARTICLE_MODEL') private readonly ArticleModel: ModelType<Article>) {}

	@Query((returns) => Article)
	async article(@Arg('id') id: string) {
		return await this.ArticleModel.findById(id);
	}

	@Query((returns) => [ Article ])
	async articles(): Promise<Article[]> {
		return await this.ArticleModel.find({});
	}

	// @Mutation((returns) => Article)
	// async addArticle(@Arg('article') articleInput): Promise<Article> {
	// 	const recipe = new this.ArticleModel({
	// 		...articleInput
	// 	} as Article);

	// 	return await recipe.save();
	// }
}
