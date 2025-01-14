import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [FormsModule, NgForOf],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
})
export class StockComponent implements OnInit {
  stockItems: { name: string; quantity: number; category: string }[] = [];
  newItemName: string = '';
  newItemQuantity: number | null = null;
  newItemCategory: string = '';
  isEditing: boolean = false;
  editingIndex: number | null = null;

  ngOnInit(): void {
    this.loadStockFromLocalStorage();
  }

  loadStockFromLocalStorage(): void {
    const storedStock = localStorage.getItem('stockItems');
    if (storedStock) {
      this.stockItems = JSON.parse(storedStock);
    }
  }

  saveStockToLocalStorage(): void {
    localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
  }

  addStockItem(event: Event): void {
    event.preventDefault();
    if (!this.newItemName || !this.newItemQuantity || !this.newItemCategory) {
      alert('Please fill out all fields.');
      return;
    }

    if (this.isEditing && this.editingIndex !== null) {
      this.stockItems[this.editingIndex] = {
        name: this.newItemName,
        quantity: this.newItemQuantity,
        category: this.newItemCategory,
      };
      this.isEditing = false;
      this.editingIndex = null;
    } else {
      this.stockItems.push({
        name: this.newItemName,
        quantity: this.newItemQuantity,
        category: this.newItemCategory,
      });
    }

    this.saveStockToLocalStorage();
    this.resetForm();
  }

  editStockItem(index: number): void {
    this.isEditing = true;
    this.editingIndex = index;
    const item = this.stockItems[index];
    this.newItemName = item.name;
    this.newItemQuantity = item.quantity;
    this.newItemCategory = item.category;
  }

  deleteStockItem(index: number): void {
    this.stockItems.splice(index, 1);
    this.saveStockToLocalStorage();
  }

  resetForm(): void {
    this.newItemName = '';
    this.newItemQuantity = null;
    this.newItemCategory = '';
  }
}
