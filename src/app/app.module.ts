import { insertImport } from '@angular/cli/lib/ast-tools';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { WpApiModule, WpApiLoader, WpApiStaticLoader } from 'wp-api-angular';

export function WpApiLoaderFactory(http: Http) {
  return new WpApiStaticLoader(
    http,
    'http://wpapp.dev/wp-json/'
    /* namespace is optional, default: '/wp/v2' */
  );
}

import { CoolStorageModule } from 'angular2-cool-storage';
import { NgSpinKitModule } from 'ng-spin-kit';
import { TagCloudModule } from 'angular-tag-cloud-module';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';

import { GamesService } from './services/games.service';
import { AuthService } from './auth/auth.service';
import { AppComponent } from './app.component';
import { GamesListComponent } from './games-list/games-list.component';
import { AbbreviateStringPipe } from './common/abbreviate-string.pipe';
import { TileBlankPipe } from './common/tile-blank.pipe';
import { SanitizeHtmlPipe } from './common/sanitizeHtml.pipe';
import { BoardViewComponent } from './board-view/board-view.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { MoveBoardComponent } from './move-board/move-board.component';
import { MovePanelComponent } from './move-panel/move-panel.component';
import { MoveNavComponent } from './move-nav/move-nav.component';
import { UiSettingsComponent } from './ui-settings/ui-settings.component';
import { UiPlaytabComponent } from './ui-playtab/ui-playtab.component';
import { UiMovelistComponent } from './ui-movelist/ui-movelist.component';
import { UiTrackingComponent } from './ui-tracking/ui-tracking.component';
// import { FlashViewComponent } from './flash-view/flash-view.component';
import {
  GamesResolver,
  TagsResolver,
  TagSlugResolver,
  GamesDetailResolver
} from './providers/games-api-resolver';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';

import {
  BASEURL,
  baseURL,
  AUTHAPI,
  authAPI,
  CUSTOMAPI,
  customAPI,
  TOTAL_SQR,
  totalsqr,
  COLORNAMES,
  colornames,
  USER,
  User,
  REQUESTARGS,
  RequestOptionsArgs
} from './providers/providers';

@NgModule({
  declarations: [
    AppComponent,
    GamesListComponent,
    AbbreviateStringPipe,
    BoardViewComponent,
    HomeViewComponent,
    MoveBoardComponent,
    MovePanelComponent,
    MoveNavComponent,
    UiSettingsComponent,
    UiPlaytabComponent,
    UiMovelistComponent,
    UiTrackingComponent,
    TileBlankPipe,
    SanitizeHtmlPipe
  ],
  imports: [
    NgSpinKitModule,
    CoolStorageModule,
    TagCloudModule,
    BrowserModule,
    WpApiModule.forRoot({
      provide: WpApiLoader,
      useFactory: WpApiLoaderFactory,
      deps: [Http]
    }),
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    // CarouselModule.forRoot(),
    AppRoutingModule,
    AuthModule
  ],
  providers: [
    {
      provide: AUTHAPI,
      useValue: authAPI
    },
    {
      provide: BASEURL,
      useValue: baseURL
    },
    {
      provide: CUSTOMAPI,
      useValue: customAPI
    },
    {
      provide: COLORNAMES,
      useValue: colornames
    },
    {
      provide: TOTAL_SQR,
      useValue: totalsqr
    },
    {
      provide: USER,
      useValue: User
    },
    {
      provide: REQUESTARGS,
      useValue: RequestOptionsArgs
    },
    GamesService,
    AuthService,
    GamesResolver,
    GamesDetailResolver,
    TagsResolver,
    TagSlugResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
