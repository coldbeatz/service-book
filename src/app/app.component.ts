import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule for Angular directives
    RouterOutlet, // RouterOutlet for routing
    TooltipModule // Make sure TooltipModule is properly initialized
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'service-book';
}
