import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, Apollo } from 'apollo-angular';

@NgModule({
	declarations: [ AppComponent, HttpClientModule, HttpLinkModule ],
	imports: [ BrowserModule.withServerTransition({ appId: 'serverApp' }), AppRoutingModule ],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {
	constructor(apollo: Apollo, httpLink: HttpLink) {
		apollo.create({
			link: httpLink.create({ uri: 'http://graphql.virllage.com:8080/api' }),
			cache: new InMemoryCache()
		});
	}
}
