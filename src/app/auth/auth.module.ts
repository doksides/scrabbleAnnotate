import {NgModule} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
// import {CoolLocalStorage} from 'angular2-cool-storage';

export function authHttpServiceFactory(http : Http, options : RequestOptions) {
    return new AuthHttp(new AuthConfig({tokenGetter: (() => localStorage.getItem('token'))}), http, options);
}

@NgModule({
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        }
    ]
})
export class AuthModule {}