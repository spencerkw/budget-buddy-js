"use strict";

//holds each item the user adds (name and cost)
class BudgetItem {
  constructor(name, cost) {
    this.name = name;
    this.cost = cost;
  }
  //returns a formatted HTML block for the item's li element
  displayHTML() {
    return `
    <p class="item-name">${this.name}</p>
    <p class="item-cost">$${this.cost}</p>
    <button class="remove-btn"><i class="fas fa-minus"></i></button>
    `;
  }
}

//represents each category in the budget (bills, food, clothing, entertainment)
//each category holds its own items
class BudgetCategory {
  constructor(name) {
    this.name = name;
    this.items = [];
  }
  //add an item with the given values to the array
  addItem(name, cost) {
    this.items = [...this.items, new BudgetItem(name, cost)];
  }
  //remove an item at the given index from the array
  removeItemAt(index) {
    this.items = [...this.items.slice(0, index), ...this.items.slice(index + 1)];
  }
  //return the total cost of this category's items
  calculateTotal() {
    let total = 0;
    for (let item of this.items) {
      total += item.cost;
    }
    return total;
  }
  //update the category's DOM display
  //includes the list of items and the category total cost
  display() {
    let categoryUL = document.querySelector(`ul.item-list.${this.name}`);
    categoryUL.innerHTML = "";
    for(let index in this.items) {
      const newEntry = document.createElement("li");
      newEntry.setAttribute("index", index);
      newEntry.classList.add(`${this.name}`);
      newEntry.innerHTML = this.items[index].displayHTML();
      categoryUL.append(newEntry);
    }

    //update the visual category total
    let sectionTotalP = document.querySelector(`p.section-total.${this.name}`);
    sectionTotalP.innerText = `$${this.calculateTotal()}`;
  }
}

//contains all the budget info for the site
//directly contains the 4 categories, and indirectly their items
class TotalBudget {
  constructor() {
    this.maxBudget = 0;
    this.categories = [
      new BudgetCategory("bills"),
      new BudgetCategory("food"),
      new BudgetCategory("clothing"),
      new BudgetCategory("entertainment")
    ];
  }
  //returns the category with the given name
  //useful for in and outside of this object
  getCategory(categoryName) {
    return this.categories.find(category => category.name === categoryName);
  }
  //tells the given category to add an item with the given values to itself
  //also updates the total budget display
  addItem(name, cost, categoryName) {
    this.getCategory(categoryName).addItem(name, cost);
    this.displayBudgetRemaining();
  }
  //tells the given category to remove its item at the given index
  //also updates the total budget display
  removeItem(index, categoryName) {
    this.getCategory(categoryName).removeItemAt(index);
    this.displayBudgetRemaining();
  }
  //returns the total cost of the budget (from all categories)
  calculateTotal() {
    let total = 0;
    for (let category of this.categories) {
      total += category.calculateTotal();
    }
    return total;
  }
  //tells the given category to update its display
  displayCategory(categoryName) {
    this.getCategory(categoryName).display();
  }
  //updates the display for the remaining budget
  displayBudgetRemaining() {
    let remaining = this.maxBudget - this.calculateTotal();
    document.querySelector("p.budget-remaining").innerText = `Remaining Budget: $${remaining}`;
    //TODO do some checking to see if over budget
  }
}

//the budget object
const totalBudget = new TotalBudget();
//console.log(totalBudget.addItem);

//handler for when one of the add item forms is submitted
//adds the item to that category, updates that category's display
//resets the form
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

//handler for when one of the items is removed
//removes the item from the appropriate category and redisplays that category
function removeItemFromCategory(event) {
  let target = event.target;
  if (event.target.parentNode.classList.contains("remove-btn")) {
    target = target.parentNode;
  }
  //get the index attribute from the list item
  let index = target.parentNode.attributes["index"].value;
  //get the class (category name) from the list item
  let categoryName = target.parentNode.classList[0];
  totalBudget.removeItem(index, categoryName);
  totalBudget.displayCategory(categoryName);
}

//handler for when the user updates their max budget
function updateMaxBudget(event) {
  event.preventDefault();
  totalBudget.maxBudget = Number(event.target.children[0].value);
  document.querySelector("p.budget-max").innerText = `Total Budget: $${totalBudget.maxBudget}`;
  totalBudget.displayBudgetRemaining(); //update the budget remaining

  event.target.children[0].value = ""; //clear the input
}

//add event listeners to the main for both clicking buttons and submitting forms
let main = document.querySelector("main");
main.addEventListener("submit", function(event) {
  if (event.target.classList.contains("add-item")) {
    addItemToCategory(event);
  } else if (event.target.classList.contains("max-budget-form")) {
    updateMaxBudget(event);
  }
});
main.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-btn") || event.target.parentNode.classList.contains("remove-btn")) {
    removeItemFromCategory(event);
  }
});

//console.log(totalBudget);