"use strict";

class BudgetItem {
  constructor(name, cost) {
    this.name = name;
    this.cost = cost;
  }
}

class BudgetCategory {
  constructor(name) {
    this.name = name;
    this.items = [];
  }
  addItem(name, cost) {
    this.items.push(new BudgetItem(name, cost));
  }
  calculateTotal() {
    let total = 0;
    for (let item of this.items) {
      total += item.cost;
    }
    return total;
  }
}

class TotalBudget {
  constructor() {
    // this.categories = [
    //   new BudgetCategory("Bills"),
    //   new BudgetCategory("Food"),
    //   new BudgetCategory("Clothing"),
    //   new BudgetCategory("Entertainment")
    // ];
    this.bills = new BudgetCategory("bills");
    this.food = new BudgetCategory("food");
    this.clothing = new BudgetCategory("clothing");
    this.entertainment = new BudgetCategory("entertainment");
  }
  addItem(name, cost, categoryName) {
    for (let category of this) {
      if (category.name === categoryName.toLowerCase()) {
        category.addItem(name, cost);
        break;
      }
    }
  }
  calculateTotal() {
    let total = 0;
    for (let category of this) {
      total += category.calculateTotal();
    }
    return total;
  }
}