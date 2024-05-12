import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent, NavbarComponent} from "../components";
import {SpinnerComponent} from "../shared/ui/spinner/spinner.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ClothShop';

}
