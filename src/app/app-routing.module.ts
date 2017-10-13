import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeViewComponent} from './home-view/home-view.component';
import {BoardViewComponent} from './board-view/board-view.component';
import {GamesResolver, TagsResolver, TagSlugResolver, GamesDetailResolver} from './providers/games-api-resolver';

const appRoutes : Routes = [
  {
    path: 'tag/:id',
    component: HomeViewComponent,
    data: {
      routename: 'tag_id',
      title: 'Games Tagged '
    },
    resolve: {
      data: TagsResolver
    }
  }, {
    path: 'games/tagged/:slug',
    component: HomeViewComponent,
    data: {
      routename: 'tag_slug',
      title: 'Games Tagged '
    },
    resolve: {
      data: TagSlugResolver
    }
  }, {
    path: 'game/:slug/:moveno',
    component: BoardViewComponent,
    data: {
      title: 'Moves'
    },
    resolve: {
      detail: GamesDetailResolver
    }
  }, {
    path: '',
    component: HomeViewComponent,
    data: {
      routename: 'main',
      title: 'Annotated Games List'
    },
    resolve: {
      data: GamesResolver
    }
  }, {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
  //   { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
