// module pattern: return an object containing all of the function that we want to be public,
// so, the function that we want to give the outside scope access to

// IIFE create a new scope that's not visible from the outside scope,
// so the variable and function is safe, they can't be access from the outside
/*
var budgetController = (function() {
  var x = 23;
  var add = function (a) {
    return x + a;
  }

  return {
    // publicTest is a method, and it can be access from the outside scope. Outside scope can access the var x and the add function because of Closure from the publicTest method
    publicTest: function(b) {
      return add(b);
    }
  }
})();*/

// BUDGET CONTROLLER
var budgetController = (function() {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;
      // [1,2,4,6,8], next ID = 9
      // ID = last ID + 1

      // Membuat ID baru buat var data
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id+1;
      } else {
        ID = 0;
      }

      // Membuat item baru berdasarkan type 'inc' atau 'exp'
      if(type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val)
      }

      // push (insert) data dari form input add description ke var data
      data.allItems[type].push(newItem);

      // return the new element
      return newItem;
    },
    testing: function () {
      console.log(data);
    }
  };
})();


// UI CONTROLLER
var UIController = (function() {
  // Create css class variables
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  // return supaya bisa diakses oleh function yg lain di outer scope
  return {
    getInput: function() {
      // baca value yg ada di input tag
      // Return 3 values at the same time, return an object containing these 3 as properties
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp (dari select option value di index.html)
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    addListItem: function (obj, type) {
      var html, newHTML;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp') {
      html = '<div class="item clearfix" id="expense--%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // Replace the placeholder text with some actual data
      // obj.id ambil dari budgetCtrl Expense
      newHTML = html.replace('%id%', obj.id);
      newHTML = newHTML.replace('%description%', obj.description);
      newHTML = newHTML.replace('%value%', obj.value);

      // Insert the HTML into the DOM
      // developer.mozilla.org/en-US/docs/WEB/API/Element/InsertAdjacentHTML





    },
    // Exposing DOMstrings object into the public
    getDOMstrings: function() {
      return DOMstrings;
    }
  };

})();

// Connecting 2 controller
// Module can receive arguments because they are just function expression, so, we can pass arguments into them. We eill pass the other two module as arguments to te controller, so this controller knows about the other two and connect them
/*
var controller = (function(budgetCtrl, UICtrl) {
  var z = budgetCtrl.publicTest(5);
  return {
    anotherPublic: function() {
      console.log(z);
    }
  }
})(budgetController, UIController);*/

// GLOBAL APP CONTROLLER
// EVENT REFERENCE: developer.mozilla.org/en-US/docs/Web/Events
// KEYCODE REFERENCE: http://keycodes.atjayjo.com/#charcode
var controller = (function(budgetCtrl, UICtrl) {
  var setupEventListeners = function() {
    // Get DOMstrings from the UI controller
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // listen for keyboard EVENT on the document level
    document.addEventListener('keypress', function(event) {
      // Detect if the Enter button is pressed
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();
    // console.log(input);

    // 2. Add the item to the budget CONTROLLER
    // addItem return an object
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on the UI
  };

  return {
    init: function () {
      // console.log('Aplication started');
      setupEventListeners();
    }
  };
})(budgetController, UIController);

// Initialize setupEventListeners function
controller.init();
