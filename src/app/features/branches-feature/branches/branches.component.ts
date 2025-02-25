import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Tag } from 'primeng/tag';
import { Rating } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { DataView } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: boolean;
  type: string;
  createdAt: Date;
}

@Component({
  selector: 'app-branches',
  imports: [
    DataView,
    Tag,
    Rating,
    ButtonModule,
    CommonModule,
    SelectButton,
    FormsModule
  ],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss',
})
export class BranchesComponent {
  layout = signal<'grid'| 'list'>('grid');
  options = ['list', 'grid']; 
  branches = signal<Branch[]>([
    {
      id: 1,
      name: 'Sucursal Principal Norte',
      address: 'Av. Los Pinos 123',
      phone: '912345678',
      email: 'sucursal1@empresa.com',
      status: true,
      type: 'Principal',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'Sucursal Express Sur',
      address: 'Av. Las Flores 456',
      phone: '923456789',
      email: 'sucursal2@empresa.com',
      status: true,
      type: 'Express',
      createdAt: new Date('2024-02-01')
    },
    {
      id: 3,
      name: 'Sucursal Secundaria Este',
      address: 'Av. Central 789',
      phone: '934567890',
      email: 'sucursal3@empresa.com',
      status: false,
      type: 'Secundaria',
      createdAt: new Date('2024-02-15')
    },
    {
      id: 4,
      name: 'Sucursal Principal Oeste',
      address: 'Av. Libertad 321',
      phone: '945678901',
      email: 'sucursal4@empresa.com',
      status: true,
      type: 'Principal',
      createdAt: new Date('2024-02-20')
    }
  ]);

  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }

  getStatusLabel(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }
}
