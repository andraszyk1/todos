import { apiAddTodo, apiDeleteTodo } from "./api/todos";
import { Category, Task as TTask, categories, Mode } from "./types";

export class Todos {
  name: string;
  category: string;
  done: boolean;
  taskToHighlight: string;
  tasks: TTask[];
  headerContainer: HTMLElement | null;
  todosContainer: HTMLElement | null;
  formContainer: HTMLElement;
  tasksContainer: HTMLElement;
  mode: Mode;
  constructor(initialTasks: TTask[], mode: Mode) {
    this.tasks = initialTasks;
    this.name = "";
    this.taskToHighlight = "";
    this.category = "";
    this.done = false;
    this.todosContainer = document.querySelector(".todos");
    this.headerContainer = document.createElement("h1");
    this.headerContainer.textContent = "Lista zadań";
    this.todosContainer?.appendChild(this.headerContainer);
    this.formContainer = document.createElement("div");
    this.formContainer.classList.add("formContainer");
    this.tasksContainer = document.createElement("div");
    this.tasksContainer.classList.add("tasks");
    this.mode = mode;
    // const task1 = new Task(1,"Wyrzucić śmieci", Category.HOUSE, false);
    // const task2 = new Task(2,"Poćwiczyć kręgosłup", Category.GYM, false);
    // this.addTask(task1);
    // this.addTask(task2);
    this.createForm();
    this.showTasks();
  }
  async addTask(task: TTask) {
    this.taskToHighlight = "";
    let newTask;
    if (this.mode === Mode.DEV) {
      newTask = await apiAddTodo(task);
    }
    if (this.mode === Mode.PROD) {
      newTask = task;
    }
    if (newTask) {
      this.taskToHighlight = newTask.id;
      this.tasks.push(newTask);
      this.showTasks();
    }
  }
  clearInputNameValue() {
    let input = document.getElementById("name") as HTMLInputElement;
    input.value = "";
  }
  clearInputCheckBoxValue() {
    let input = document.getElementById("done") as HTMLInputElement;
    input.checked = false;
  }
  clearInputRadioValue() {
    let radios = document.querySelectorAll(".radio");
    radios.forEach((radio) => {
      if (radio instanceof HTMLInputElement) {
        radio.checked = false;
      }
    });
  }
  clearError() {
    let element = document.querySelector(".error") as HTMLInputElement;
    if (element) element.remove();
  }
  updateTaskDone(id: string, value: boolean) {
    let taskToUpdate = this.tasks.find((task) => task.id === id);
    if (taskToUpdate) {
      this.tasks = [...this.tasks, { ...taskToUpdate, done: value }];
    }
  }
  async deleteTask(id: string) {
    if(this.mode===Mode.DEV)
    await apiDeleteTodo(id);
    let newTasks = this.tasks.filter((task) => task.id !== id);
    this.tasks = [...newTasks];

    this.showTasks();
  }
  createForm() {
    let form = document.createElement("form");

    let formInputWrapper = document.createElement("div");
    formInputWrapper.classList.add("formInputWrapper");
    form.classList.add("form");
    let inputName = document.createElement("input");
    inputName.name = "name";
    inputName.type = "text";
    inputName.id = "name";
    inputName.addEventListener("change", (e: Event) => {
      const value = e.target instanceof HTMLInputElement ? e.target.value : "";
      this.name = value;
      if (this.name !== "") {
        this.clearError();
      }
    });
    let labelForName = document.createElement("label");
    labelForName.htmlFor = inputName.id;
    labelForName.textContent = "Wpisz zadanie";
    formInputWrapper.appendChild(labelForName);
    formInputWrapper.appendChild(inputName);

    form.appendChild(formInputWrapper);
    let inputDone = document.createElement("input");
    inputDone.name = "done";
    inputDone.type = "checkbox";
    inputDone.id = "done";
    inputDone.addEventListener("change", (e: Event) => {
      const value =
        e.target instanceof HTMLInputElement ? e.target.checked : "";
      this.done = Boolean(value);
    });
    let labelForDone = document.createElement("label");
    labelForDone.htmlFor = inputDone.id;
    labelForDone.textContent = "Zrobione";

    let formInputWrapper2 = document.createElement("div");
    formInputWrapper2.classList.add("formInputWrapper");
    labelForDone.appendChild(inputDone);
    formInputWrapper2.appendChild(labelForDone);

    let spanForDone = document.createElement("span");
    spanForDone.classList.add("checkmark");
    labelForDone.appendChild(spanForDone);
    form.appendChild(formInputWrapper2);
    let categoriesHeader = document.createElement("h1");
    categoriesHeader.textContent = "Kategorie";
    form.appendChild(categoriesHeader);
    categories.map((category: Category) => {
      let radio = document.createElement("input");
      radio.type = "radio";
      radio.id = category;
      radio.classList.add("radio");
      radio.value = category;
      radio.name = "category";
      radio.title = category;
      radio.addEventListener("change", (e: Event) => {
        const value =
          e.target instanceof HTMLInputElement ? e.target.value : "";
        this.category = value;
      });
      let labelForRadio = document.createElement("label");
      labelForRadio.htmlFor = radio.id;
      labelForRadio.textContent = category;

      labelForRadio.appendChild(radio);
      let spanForRadio = document.createElement("span");
      spanForRadio.classList.add("checkmark");
      labelForRadio.appendChild(spanForRadio);
      let formInputWrapper3 = document.createElement("div");
      formInputWrapper3.classList.add("formInputWrapper");
      formInputWrapper3.appendChild(labelForRadio);

      form.appendChild(formInputWrapper3);
    });
    let btnAddTask = document.createElement("button");
    btnAddTask.id = "counter";
    btnAddTask.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.clearError();
      if (this.name === "") {
        let errorInputName = document.createElement("p");
        errorInputName.classList.add("error");
        errorInputName.textContent = "Wpisz zadanie !";
        btnAddTask.after(errorInputName);
      } else {
        this.addTask({
          id: String(Math.random()*100000)+new Date().toDateString(),
          name: this.name,
          category: this.category,
          done: this.done,
        });
        this.name = "";
        this.done = false;
        this.category = "";
        this.clearError();
        this.clearInputNameValue();
        this.clearInputCheckBoxValue();
        this.clearInputRadioValue();
      }
    });
    btnAddTask.innerText = "Dodaj";
    form.appendChild(btnAddTask);
    this.formContainer?.appendChild(form);
    this.todosContainer?.appendChild(this.formContainer);
  }
  clearTaskElements() {
    const allTasks = document.querySelectorAll(".task");
    allTasks.forEach((task) => {
      task.remove();
    });
  }
  showTasks() {
    this.clearTaskElements();

    this.tasks.map((task) => {
      let taskElement = document.createElement("div") as HTMLDivElement;
      taskElement.classList.add("task");
      if (task.id === this.taskToHighlight)
        taskElement.style.animation = "example 0.3s linear 1 alternate";

      let pName = document.createElement("p");
      pName.textContent = task.name;
      let pCategory = document.createElement("p");
      pCategory.textContent = task.category;
      let pDone = document.createElement("p");
      let checkboxDone = document.createElement("input");
      checkboxDone.type = "checkbox";
      checkboxDone.checked = task.done;
      if (task.done === true) {
        taskElement.classList.add("done");
      }
      checkboxDone.addEventListener("change", (e: Event) => {
        const value =
          e.target instanceof HTMLInputElement ? e.target.checked : undefined;
        if (value === true) {
          taskElement.classList.add("done");
          this.updateTaskDone(task.id, value);
        } else {
          console.log(taskElement.classList.remove("done"));
        }
      });
      pDone.appendChild(checkboxDone);
      let spanForPDone = document.createElement("span");
      spanForPDone.classList.add("checkmark");
      pDone.appendChild(spanForPDone);
      spanForPDone.parentElement?.classList.add("inputDoneWrapper");
      let deleteButton = document.createElement("button");
      let deleteIcon = document.createElement("img");
      deleteIcon.classList.add("deleteIcon");
      deleteButton.textContent = "Usuń";
      deleteButton.appendChild(deleteIcon);
      deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.deleteTask(String(task.id));
        this.taskToHighlight = "";
      });

      taskElement?.appendChild(pName);
      taskElement?.appendChild(pCategory);
      taskElement?.appendChild(pDone);
      taskElement?.appendChild(deleteButton);
      this.tasksContainer?.appendChild(taskElement);
      this.todosContainer?.appendChild(this.tasksContainer);
    });
  }
}
