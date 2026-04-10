import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, MatListModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  links = [
    {
      title: 'Cocktails',
      path: ['/cocktails'],
    },
    {
      title: 'Glass Types',
      path: ['/'],
    },
    {
      title: 'Categories',
      path: ['/categories'],
    },
    {
      title: 'Ingredients',
      path: ['/ingredients'],
    },
    {
      title: 'Autocompelete',
      path: ['/autocompelete'],
    },
  ];
}
