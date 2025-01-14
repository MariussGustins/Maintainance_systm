import { Component, OnInit } from '@angular/core';
import { NgForOf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-work-hours',
  standalone: true,
  imports: [NgForOf, CommonModule],
  templateUrl: './work-hours.component.html',
  styleUrls: ['./work-hours.component.css'],
})
export class WorkHoursComponent implements OnInit {
  rows: { date: string; task: string; hours: number }[] = [];
  goal: number = 100; // Default goal
  totalHours: number = 0;
  chart: any;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.loadFromLocalStorage();
    this.calculateTotalHours();
    this.initializeChart();

  }
  goBack(): void {
    this.router.navigate(['/main-page']); // Navigate to the main page
  }
  loadFromLocalStorage(): void {
    const storedData = localStorage.getItem('workHours');
    const storedGoal = localStorage.getItem('workHoursGoal');

    if (storedData) {
      this.rows = JSON.parse(storedData);
    }

    if (storedGoal) {
      this.goal = parseInt(storedGoal, 10);
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('workHours', JSON.stringify(this.rows));
    localStorage.setItem('workHoursGoal', this.goal.toString());
  }

  calculateTotalHours(): void {
    this.totalHours = this.rows.reduce((sum, row) => sum + row.hours, 0);
    this.updateChart();
  }

  setGoal(): void {
    const input = prompt('Ievadi stundas cik paredzētas šomēnes:', this.goal.toString());
    if (input) {
      this.goal = parseInt(input, 10);
      this.saveToLocalStorage();
      this.updateChart();
    }
  }

  addWorkHours(): void {
    const date = prompt('Ievadi datumu (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    const task = prompt('Ievadi uzdevumu:', 'Task');
    const hours = prompt('Ievadi stundas:', '0');

    if (date && task && hours) {
      this.rows.push({
        date,
        task,
        hours: parseInt(hours, 10),
      });
      this.calculateTotalHours();
      this.saveToLocalStorage();
    }
  }

  initializeChart(): void {
    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Nostrādātas Stundas', 'Atlikušas Stundas'],
        datasets: [
          {
            data: [this.totalHours, Math.max(this.goal - this.totalHours, 0)],
            backgroundColor: ['#4CAF50', '#E0E0E0'],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = [
        this.totalHours,
        Math.max(this.goal - this.totalHours, 0),
      ];
      this.chart.update();
    }
  }
}
