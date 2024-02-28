import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalComponent} from "../../components/modal/modal.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {}
