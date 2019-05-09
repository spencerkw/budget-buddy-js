"use strict";

class BudgetItem {
  constructor(name, cost) {
    this.name = name;
    this.cost = cost;
  }
  displayHTML() {
    return `
    <p>${this.name}</p>
    <p>$${this.cost}</p>
    <button>Remove</button>
    `;
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
  display() {
    let categoryUL = document.querySelector(`ul.item-list.${this.name}`);
    categoryUL.innerHTML = "";
    for(let index in this.items) {
      const newEntry = document.createElement("li");
      newEntry.setAttribute("index", index);
      newEntry.innerHTML= this.items[index].displayHTML();
      categoryUL.append(newEntry);
    }
  }
}

class TotalBudget {
  constructor() {
    this.categories = [
      new BudgetCategory("bills"),
      new BudgetCategory("food"),
      new BudgetCategory("clothing"),
      new BudgetCategory("entertainment")
    ];
  }
  getCategory(categoryName) {
    return this.categories.find(category => category.name === categoryName);
  }
  addItem(name, cost, categoryName) {
    this.getCategory(categoryName).addItem(name, cost);
  }
  calculateTotal() {
    let total = 0;
    for (let category of this) {
      total += category.calculateTotal();
    }
    return total;
  }
  displayCategory(categoryName) {
    this.getCategory(categoryName).display();
  }
}

const totalBudget = new TotalBudget();
//console.log(totalBudget.addItem);

function addItemToCategory(event) {
  event.preventDefault();
  // console.dir(event);
  // console.dir(event.target);
  //event.target is the form that was submitted

  //get the category name via the form's class
  let categoryName = event.target.classList[1];
  //get the input values
  let name = event.target.children[0].value;
  let cost = Number(event.target.children[1].value);

  totalBudget.addItem(name, cost, categoryName);
  totalBudget.displayCategory(categoryName);

  //clear the form inputs and refocus the first one
  event.target.children[0].focus();
  event.target.children[0].value = "";
  event.target.children[1].value = "";
}

let main = document.querySelector("main");
main.addEventListener("submit", function(event) {
  if (event.target.classList.contains("add-item")) {
    addItemToCategory(event);
  }
})

console.log(totalBudget);