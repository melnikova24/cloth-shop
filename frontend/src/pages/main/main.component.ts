import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductListComponent} from "../../features/product-list/product-list.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {}
