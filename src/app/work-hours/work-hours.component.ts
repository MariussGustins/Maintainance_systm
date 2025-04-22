/**
 * Autors: Mariuss Gustins
 * Apraksts: Komponents, kas pārvalda darba stundu pievienošanu, mērķu uzstādīšanu un progresu.
 *            Iespējama darba stundu ievade un mērķa noteikšana ar vizuālu attēlojumu (diagrammu).
 *            Dati tiek saglabāti un ielādēti no LocalStorage.
 * Atslēgvārdi: darba stundas, stundu mērķis, darba stundu pārvaldība, diagramma, LocalStorage
 */
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
  /** Saraksts ar darba stundām */
  rows: { date: string; task: string; hours: number }[] = [];
  /** Noklusējuma darba stundu mērķis */
  goal: number = 100;
  /** Kopējais nostrādāto stundu skaits */
  totalHours: number = 0;
  /** Diagrammas objekts */
  chart: any;
  todayHours: number = 0;
  weeklyHours: number = 0;

  constructor(private router: Router) {}

  /** Inicializācijas metode, ielādē saglabātos datus un inicializē diagrammu */
  ngOnInit(): void {
    this.loadFromLocalStorage();
    this.calculateTotalHours();
    this.calculateTodayAndWeeklyHours();
    this.initializeChart();
  }

  /** Navigācija atpakaļ uz galveno lapu */
  goBack(): void {
    this.router.navigate(['/main-page']);
  }

  calculateTodayAndWeeklyHours(): void {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const startOfWeek = this.getMonday(new Date());

    // Šodienas nostrādātās stundas
    this.todayHours = this.rows
      .filter(r => r.date === today)
      .reduce((sum, r) => sum + r.hours, 0);

    // Stundas šajā nedēļā
    this.weeklyHours = this.rows
      .filter(r => new Date(r.date) >= startOfWeek)
      .reduce((sum, r) => sum + r.hours, 0);
  }

  /** Funkcija, kas iegūst pirmdienu attiecīgajai nedēļai */
  getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Pirmdiena
    return new Date(date.setDate(diff));
  }

  /** Ielādē darba stundu un mērķu datus no LocalStorage */
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

  /** Saglabā darba stundu un mērķu datus LocalStorage */
  saveToLocalStorage(): void {
    localStorage.setItem('workHours', JSON.stringify(this.rows));
    localStorage.setItem('workHoursGoal', this.goal.toString());
  }

  /** Aprēķina kopējo nostrādāto stundu skaitu un atjauno diagrammu */
  calculateTotalHours(): void {
    this.totalHours = this.rows.reduce((sum, row) => sum + row.hours, 0);
    this.updateChart();
  }

  /**
   * Uzstāda jaunu darba stundu mērķi.
   */
  setGoal(): void {
    const input = prompt('Ievadi stundas cik paredzētas šomēnes:', this.goal.toString());
    if (input) {
      this.goal = parseInt(input, 10);
      this.saveToLocalStorage();
      this.updateChart();
    }
  }

  /**
   * Pievieno jaunas nostrādātās stundas.
   */
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

  /** Inicializē darba stundu progresu attēlojošo diagrammu */
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

  /** Atjauno diagrammu ar jaunākajiem darba stundu datiem */
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
