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
    <button class="remove-btn">Remove</button>
    `;
  }
}

class BudgetCategory {
  constructor(name) {
    this.name = name;
    this.items = [];
  }
  addItem(name, cost) {
    this.items = [...this.items, new BudgetItem(name, cost)];
  }
  removeItemAt(index) {
    this.items = [...this.items.slice(0, index), ...this.items.slice(index + 1)];
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
      newEntry.classList.add(`${this.name}`);
      newEntry.innerHTML= this.items[index].displayHTML();
      categoryUL.append(newEntry);
    }

    //update the visual category total
    let sectionTotalP = document.querySelector(`p.section-total.${this.name}`);
    sectionTotalP.innerText = `$${this.calculateTotal()}`;
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
  removeItem(index, categoryName) {
    this.getCategory(categoryName).removeItemAt(index);
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

function removeItemFromCategory(event) {
  //get the index attribute from the list item
  let index = event.target.parentNode.attributes["index"].value;
  //get the class (category name) from the list item
  let categoryName = event.target.parentNode.classList[0];
  totalBudget.removeItem(index, categoryName);
  totalBudget.displayCategory(categoryName);
}

let main = document.querySelector("main");
main.addEventListener("submit", function(event) {
  if (event.target.classList.contains("add-item")) {
    addItemToCategory(event);
  }
});

main.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-btn")) {
    removeItemFromCategory(event);
  }
});

console.log(totalBudget);