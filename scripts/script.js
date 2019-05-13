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
    let budgetRemainingP = document.querySelector("p.budget-remaining");
    budgetRemainingP.innerText = `Remaining Budget: $${remaining}`;
    //TODO do some checking to see if over budget
    let alertFooter = document.querySelector("footer");
    if (remaining < 0) { //if we're over budget
      //display it and start the animation again
      alertFooter.style.display = "flex";
      alertFooter.style.animationPlayState = "running";
      //make the remaining budget red
      budgetRemainingP.style.color = "red";

      //play the warning sound
      warningSound.pause();
      warningSound.currentTime = 0;
      warningSound.play();

      //disable the forms
      toggleFormsDisabled(true);
    } else if (remaining >= 0) { //if we're not over budget
      //hide the footer and pause the animation
      alertFooter.style.display = "none";
      alertFooter.style.animationPlayState = "paused";
      //make the remaining budget normal color
      budgetRemainingP.style.color = "inherit";

      //enable the forms
      toggleFormsDisabled(false);
    }
  }

  printReceipt() {
    //selects the class of .receipt
    let receipt = document.querySelector(".receipt");
    //for of loop that loops through categories and adds the HTML to make up the receipt
    for (let category of this.categories) {
      //sets a variable of receiptCategoryDiv to the element with a class equal to the name of the category
      let receiptCategoryDiv = receipt.querySelector(`.${category.name}`);
      receiptCategoryDiv.innerHTML = ""; //clear the content
      if (category.items.length > 0) { //if there are items in the category
        //make a category title
        let categoryTitle = document.createElement("h3"); //creates an h3 element
        categoryTitle.innerText = `${category.name.charAt(0).toUpperCase()}${category.name.slice(1)}`;
        receiptCategoryDiv.append(categoryTitle); //appends the new h3 element to the div
        
        //create a container to list the items and add paragraphs for each of them
        let elementList = document.createElement("div");
        for (let item of category.items) {
          elementList.innerHTML += `<p>${item.name} @ $${item.cost}</p>`;
        }
        receiptCategoryDiv.append(elementList); //appends the element list to the category div
      }
    }

    //set the paragraph with the total to display the budget total
    let receiptTotal = receipt.querySelector(".receipt-total");
    receiptTotal.innerText = `$${this.calculateTotal()}/$${this.maxBudget}`;

    receipt.style.display = "block"; //display the receipt

    //play the receipt sound
    receiptSound.pause();
    receiptSound.currentTime = 0;
    receiptSound.play();
  }
}

//the budget object
const totalBudget = new TotalBudget();
//access to the sound effects
const registerSound = document.querySelector("#register-sound");
registerSound.volume = 0.5;
const warningSound = document.querySelector("#warning-sound");
const receiptSound = document.querySelector("#receipt-sound");
receiptSound.volume = 0.2;

//start with forms disabled
toggleFormsDisabled(true);

//sets all the add-item forms to be disabled or not depending on the var state
function toggleFormsDisabled(state) {
  let addItemForms = document.querySelectorAll("form.add-item");
  for (let form of addItemForms) {
    for (let element of form.children) {
      element.disabled = state;
    }
  }
}

//handler for when one of the add item forms is submitted
//adds the item to that category, updates that category's display
//resets the form
function addItemToCategory(event) {
  event.preventDefault();
  //event.target is the form that was submitted

  //get the category name via the form's class
  let categoryName = event.target.classList[1];
  //get the input values
  let name = event.target.children[0].value;
  let cost = Number(event.target.children[1].value);

  let goodInput = true; //will be set to false if either input is bad
  if (!name) { //empty string or other bad input
    event.target.children[0].classList.add("bad-input");
    goodInput = false;
  } else {
    event.target.children[0].classList.remove("bad-input");
  }

  if (!cost || cost < 0) {
    event.target.children[1].classList.add("bad-input");
    goodInput = false;
  } else {
    event.target.children[1].classList.remove("bad-input");
  }

  //if the input is good, proceed
  if (goodInput) {
    totalBudget.addItem(name, cost, categoryName);
    totalBudget.displayCategory(categoryName);

    //clear the form inputs and refocus the first one
    event.target.children[0].focus();
    event.target.children[0].value = "";
    event.target.children[1].value = "";

    registerSound.pause();
    registerSound.currentTime = 0;
    registerSound.play();
  }
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
  let budgetInput = Number(event.target.children[0].value);

  if (!budgetInput || budgetInput < 0) {
    event.target.children[0].classList.add("bad-input");
  } else {
    event.target.children[0].classList.remove("bad-input");

    totalBudget.maxBudget = budgetInput;

    toggleFormsDisabled(false); //do this before checking the remaining

    document.querySelector("p.budget-max").innerText = `Total Budget: $${totalBudget.maxBudget}`;
    totalBudget.displayBudgetRemaining(); //update the budget remaining

    event.target.children[0].value = ""; //clear the input

    registerSound.pause();
    registerSound.currentTime = 0;
    registerSound.play();
  }
}

function collapseCategory(event) {
  let categoryContainer = event.target.parentNode;
  categoryContainer.classList.toggle("collapsed");
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
  if (event.target.classList.contains("section-title")) {
    collapseCategory(event);
  } else if (event.target.classList.contains("remove-btn") || event.target.parentNode.classList.contains("remove-btn")) {
    removeItemFromCategory(event);
  } else if (event.target.classList.contains("print-btn") || event.target.parentNode.classList.contains("print-btn")) {
    totalBudget.printReceipt();
  }
});

let receipt = document.querySelector(".receipt");
receipt.addEventListener("click", function() {
  receipt.style.display = "none"; 

})