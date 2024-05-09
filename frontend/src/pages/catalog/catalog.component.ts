import {Component, OnInit} from '@angular/core';

import {ActivatedRoute} from "@angular/router";
import {SidebarComponent} from "../../shared/ui/sidebar/sidebar.component";
import {ProductListComponent} from "../../features/product-list/product-list.component";

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [SidebarComponent, ProductListComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  types!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.types = params['type'];
    });
  }
}
