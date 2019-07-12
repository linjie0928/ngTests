import { Service, Inject } from 'typedi';
import { AppRouter } from '../../../core';
import { ModelType } from 'typegoose';
import { Article } from '../entities/article.mongo.ql';

export class AlbumApi extends AppRouter {}

@Service()
export class ArticleService {
	constructor(@Inject('ARTICLE_MODEL') private readonly article: ModelType<Article>) {}
}
