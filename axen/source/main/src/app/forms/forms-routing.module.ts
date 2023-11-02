import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormControlsComponent } from './form-controls/form-controls.component';
const routes: Routes = [
  {
    path: '',
    component: FormControlsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule {}
