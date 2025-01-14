import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-work-hours',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './work-hours.component.html',
  styleUrl: './work-hours.component.css'
})
export class WorkHoursComponent {
  rows = Array(10).fill({});
}
