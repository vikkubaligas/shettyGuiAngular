import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdvanceTableRoutingModule } from './advance-table-routing.module';
import { AdvanceTableComponent } from './advance-table.component';
import { FormComponent as advanceTableForm } from './form/form.component';
import { DeleteComponent } from './delete/delete.component';
import { AdvanceTableService } from './advance-table.service';
import { ComponentsModule } from '../shared/components/components.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AdvanceTableComponent, advanceTableForm, DeleteComponent],
  providers: [AdvanceTableService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdvanceTableRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
})
export class AdvanceTableModule {}
