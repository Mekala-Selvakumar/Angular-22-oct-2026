import { Routes } from '@angular/router';
import { FirstView } from './components/first-view/first-view';
import { SecondView } from './components/second-view/second-view';
import { ThirdView } from './components/third-view/third-view';
import { FirstViewChild1 } from './components/first-view-child1/first-view-child1';
import { SecondViewChild1 } from './components/second-view-child1/second-view-child1';
import { SecondViewChild2 } from './components/second-view-child2/second-view-child2';

export const routes: Routes = [
    { path:'FirstView',pathMatch:'prefix',component:FirstView,
        children:[{ path:'FirstViewChild1', component:FirstViewChild1}]
    },
    {path:'SecondView',component:SecondView ,
    children:[{ path:'SecondViewChild1', component:SecondViewChild1},
        { path:'SecondViewChild2', component:SecondViewChild2},
    ]

    },
    {path:'ThirdView',component:ThirdView}
];
