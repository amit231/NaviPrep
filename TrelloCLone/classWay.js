// references to dom

// utility functions
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
window.onload = main;

// modal
let catagories = [
  {
    name: "Frontend taks",
    id: 12121,
    todos: [
      {
        todo: "build the draggable todo list",
        completed: false,
        id: 1212,
      },
      {
        todo: "do it fast",
        completed: false,
        id: 21,
      },
    ],
  },
  {
    name: "Backend tasks",
    id: 123132131,
    todos: [
      {
        todo: "Create apis for todo app",
        completed: false,
        id: 121,
      },
    ],
  },
];

// controller
class Todo {
  catagories = [];
  root = null;
  constructor(catagories) {
    this.catagories = catagories;
  }
  cb = null;
  generateTodoMarkup = () => {
    let fragmant = document.createDocumentFragment();

    this.catagories.map((catagory) => {
      let container = document.createElement("div");
      container.classList.add("todo__section");
      container.id = catagory.id;
      container.innerHTML = `
        <div class="todo__generator">
          <h1 calss="todo__catagory-name">${catagory.name}</h1>
          <form class="form">
            <label for="todo-creator">Write your todo</label>
            <input type="text" class="input--primary"  />
            <button class="button--primary" type="submit">Add todo</button>
          </form>
        </div>
      `;
      let todoFragmant = document.createDocumentFragment();
      catagory.todos.map((todo) => {
        let todoContainer = document.createElement("div");
        todoContainer.classList.add("todo-items__wrapper");
        todoContainer.id = todo.id;
        todoContainer.draggable = true;
        todoContainer.innerHTML = `
          <p class="todo__body">${todo.todo}</p>
          <div class="todo__tracker">
            <label for="completed-${todo.id}">Mark as complete</label>
            <input type="checkbox" id="completed-${
              todo.id
            }" class="todo-checkbox" ${todo.completed && "checked"} />
          </div>
        `;
        todoFragmant.append(todoContainer);
      });
      container.append(todoFragmant);
      fragmant.append(container);
    });
    return fragmant;
  };

  addTodo = (id, todoBody) => {
    this.catagories.forEach((c) => {
      if (c.id == id) {
        c.todos.push(todoBody);
      }
    });
    this.rerender();
  };
  toggleCompletedStatus = (id) => {
    this.catagories.forEach((c) => {
      c.todos.forEach((t) => {
        console.log("t : ", t);
        if (t.id == id) {
          console.log("t : ", t);
          t.completed = !t.completed;
          return;
        }
      });
    });
    this.rerender();
  };

  rerender = () => {
    removeAllChildNodes(this.root);
    let todoMarkup = this.generateTodoMarkup();
    this.root.append(todoMarkup);
    this.cb();
  };

  render = (root, cb) => {
    this.root = root;
    this.cb = cb;
    let todoMarkup = this.generateTodoMarkup();
    this.root.appendChild(todoMarkup);
    this.cb();
  };
}

const checkboxHandler = function (e) {
  const target = e.target;
  if (e.target.classList.contains("todo-checkbox")) {
    const container = target.closest(".todo-items__wrapper");
    this.toggleCompletedStatus(container.id);
  }
};
// event listner
function onSumbmit(e) {}

function formHandler(e) {
  e.preventDefault();
  let target = e.target;
  if (e.target.classList.contains("form")) {
    let wrapper = target.closest(".todo__section");
    let ip = target.querySelector(".input--primary");
    this.addTodo(wrapper.id, {
      todo: ip.value,
      completed: false,
      id: Math.random,
    });
  }
}
function dragStart(e) {
  e.target.classList.add("dragging");
  console.log("e.target : ", e.target);
}
function dragEnd(e) {
  e.target.classList.remove("dragging");
}
function dragOver(e) {
  console.log("e.target : ", e.target);
}

function main() {
  // create object
  // bind functions
  // call render with binded callbacks
  const todoWrapper = document.querySelector(".todo__wrapper");
  let todoApp = new Todo(catagories);
  const bindedDragStart = dragStart.bind(todoApp);
  const bindedDragEnd = dragEnd.bind(todoApp);
  const bindedDragOver = dragOver.bind(todoApp);
  let bindedFormHandler = formHandler.bind(todoApp);
  let bindedCheckboxHandler = checkboxHandler.bind(todoApp);
  todoApp.render(todoWrapper, () => {
    const todoItems = document.querySelectorAll(".todo-items__wrapper");
    todoItems.forEach((todo) => {
      todo.addEventListener("dragstart", bindedDragStart);
      todo.addEventListener("dragend", bindedDragEnd);
      todo.addEventListener("dragover", bindedDragOver);
    });
  });
  // binding with the library

  todoWrapper.addEventListener("change", bindedCheckboxHandler);
  todoWrapper.addEventListener("submit", bindedFormHandler);
}

// call apply bind will not work with arrow functions
