import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTablePageRoutingModule } from './edit-table-routing.module';

import { EditTablePage } from './edit-table.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    EditTablePageRoutingModule
  ],
  declarations: [EditTablePage]
})
export class EditTablePageModule {}
