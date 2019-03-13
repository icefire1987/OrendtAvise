import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AviseCundaComponent} from './avise-cunda/avise-cunda.component';
import {HomeComponent} from './home/home.component';
import {NavWrapperComponent} from './nav-wrapper/nav-wrapper.component';

const appRoutes: Routes = [
    {
        path: '',
        component: NavWrapperComponent,
        //canActivate: [AuthGuardService]
        children: [
            {
                path: 'cunda',
                component: AviseCundaComponent,
            },
            {
                path: 'home',
                component: HomeComponent,
            }
        ]
    },

    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
