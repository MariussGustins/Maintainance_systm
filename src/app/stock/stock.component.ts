/**
 * Autors: Mariuss Gustins
 * Apraksts: Ofisa krājumu pārvaldības komponents, kas ļauj lietotājam pievienot, rediģēt un dzēst krājumus.
 *           Dati tiek saglabāti LocalStorage, lai saglabātu izmaiņas pēc lapas pārlādēšanas.
 * Atslēgvārdi: krājumi, preces, ofisa pārvaldība, inventarizācija, resursu pārvaldība
 */
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [FormsModule, NgForOf],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
})
export class StockComponent implements OnInit {
  /** Saraksts ar krājumiem */
  stockItems: { name: string; quantity: number; category: string }[] = [];
  /** Jaunās preces nosaukums */
  newItemName: string = '';
  /** Jaunās preces daudzums */
  newItemQuantity: number | null = null;
  /** Jaunās preces kategorija */
  newItemCategory: string = '';
  /** Rediģēšanas režīms */
  isEditing: boolean = false;
  /** Rediģējamā ieraksta indekss */
  editingIndex: number | null = null;
  constructor(private router: Router) {}

  /** Inicializē komponenti un ielādē krājumus no LocalStorage */
  ngOnInit(): void {
    this.loadStockFromLocalStorage();
  }

  /** Ielādē krājumus no LocalStorage */
  loadStockFromLocalStorage(): void {
    const storedStock = localStorage.getItem('stockItems');
    if (storedStock) {
      this.stockItems = JSON.parse(storedStock);
    }
  }
  /** Navigācija atpakaļ uz galveno lapu */
  goBack(): void {
    this.router.navigate(['/main-page']);
  }
  /** Saglabā krājumus LocalStorage */
  saveStockToLocalStorage(): void {
    localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
  }

  /**
   * Pievieno jaunu krājumu vai rediģē esošu.
   * @param event - Formas iesniegšanas notikums.
   */
  addStockItem(event: Event): void {
    event.preventDefault();

    const trimmedName = this.newItemName.trim();
    const trimmedCategory = this.newItemCategory.trim();

    // Validācija
    if (!trimmedName) {
      alert('Lūdzu aizpildiet preces nosaukuma lauku.');
      return;
    }
    if (this.newItemQuantity === null || this.newItemQuantity <= 0) {
      alert('Lūdzu ievadiet daudzumu (vairāk par 0).');
      return;
    }
    if (!trimmedCategory) {
      alert('Lūdzu aizpildiet kategorijas lauku.');
      return;
    }

    if (this.isEditing && this.editingIndex !== null) {
      // Rediģēšana esošajam ierakstam
      this.stockItems[this.editingIndex] = {
        name: trimmedName,
        quantity: this.newItemQuantity,
        category: trimmedCategory,
      };
      this.isEditing = false;
      this.editingIndex = null;
    } else {
      // Pārbaude vai jau eksistē ar to pašu nosaukumu un kategoriju
      const existingItem = this.stockItems.find(
        item =>
          item.name.toLowerCase() === trimmedName.toLowerCase() &&
          item.category.toLowerCase() === trimmedCategory.toLowerCase()
      );

      if (existingItem) {
        // Ja jau eksistē — papildini daudzumu
        existingItem.quantity += this.newItemQuantity;
      } else {
        // Ja neeksistē — pievieno jaunu
        this.stockItems.push({
          name: trimmedName,
          quantity: this.newItemQuantity,
          category: trimmedCategory,
        });
      }
    }

    this.saveStockToLocalStorage();
    this.resetForm();
  }


  /**
   * Aktivizē rediģēšanas režīmu konkrētam krājumam.
   * @param index - Rediģējamā krājuma indekss.
   */
  editStockItem(index: number): void {
    this.isEditing = true;
    this.editingIndex = index;
    const item = this.stockItems[index];
    this.newItemName = item.name;
    this.newItemQuantity = item.quantity;
    this.newItemCategory = item.category;
  }

  /**
   * Dzēš izvēlēto krājumu.
   * @param index - Dzēšamā krājuma indekss.
   */
  deleteStockItem(index: number): void {
    if (confirm('Vai tiešām vēlaties dzēst šo krājumu?')) {
      this.stockItems.splice(index, 1);
      this.saveStockToLocalStorage();
    }
  }

  /** Atiestata ievades laukus un atceļ rediģēšanas režīmu */
  resetForm(): void {
    this.newItemName = '';
    this.newItemQuantity = null;
    this.newItemCategory = '';
    this.isEditing = false;
    this.editingIndex = null;
  }
}
