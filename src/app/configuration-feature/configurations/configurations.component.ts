import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
@Component({
  selector: 'app-configurations',
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TextareaModule,
    SelectButtonModule,
    CalendarModule,
    CheckboxModule,
    AutoCompleteModule,
    InputNumberModule,
  ],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.scss',
})
export class ConfigurationsComponent {}
