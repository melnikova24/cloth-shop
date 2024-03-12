import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  constructor(public loaderService: LoaderService) {
  }
}
