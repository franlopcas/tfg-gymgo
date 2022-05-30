import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTablePageRoutingModule } from './create-table-routing.module';

import { CreateTablePage } from './create-table.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    CreateTablePageRoutingModule
  ],
  declarations: [CreateTablePage]
})
export class CreateTablePageModule {}
