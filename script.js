// -------
// Libary
// -------
const myLibrary = [];

// ---------------------------
// DOM elements
// ---------------------------
// Input fields
const title_field = document.getElementById('title');
const author_field = document.getElementById('author');
const pages_field = document.getElementById('pages');
const submit_btn = document.getElementById('submit');
const read_check = document.getElementById('read-check');

// Form
const book_form = document.getElementById('book-form');

// Book table body
const table_body = document.getElementById('book-list');

// Add book button
const new_book = document.getElementById('new-book-btn');

// ---------------------------
// When page loads
// ---------------------------
loadLibrary();
showLibrary();

// ---------------------------
// Persistence: Save / Load library to localStorage
// ---------------------------
function saveLibrary() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
}

function loadLibrary() {
  const stored = localStorage.getItem("library");
  if (!stored) return;

  const parsed = JSON.parse(stored);

  parsed.forEach(book => {
    addBookToLibrary(book.title, book.author, book.pages, book.read, book.id);
  });
}

// ---------------------------
// Book constructor & prototypes
// ---------------------------
function Book(title, author, pages, read, id = crypto.randomUUID()) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = id;
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read' : 'not read yet'}, ID: ${this.id}`;
}

Book.prototype.toggleRead = function () {
  if (this.read === true) {
    this.read = false;
  } else {
    this.read = true;
  }
}

// ---------------------------
// Library management
// ---------------------------
function addBookToLibrary(title, author, pages, read, id) {
  const newBook = new Book(title, author, pages, read, id);
  myLibrary.push(newBook);
}

function showLibrary() {
  // Add to table, refresh table to avoid duplicates
  table_body.innerHTML = "";
  myLibrary.forEach(book => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td><input type="checkbox" ${book.read ? "checked" : ""}></td>
      <td><button class="delete-btn">Delete</button></td>
    `;
    table_body.appendChild(row);

    // Checkbox toggle
    const checkbox = row.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", () => {
      book.toggleRead();
      saveLibrary();
      console.table(myLibrary);
    });

    // Delete button
    const delete_btn = row.querySelector('.delete-btn');
    delete_btn.addEventListener("click", () => {
      // remove from array
      const index = myLibrary.indexOf(book);
      myLibrary.splice(index, 1);

      // remove the row
      row.remove();
      saveLibrary();
    });
  });

  // And for debugging purposes
  console.table(myLibrary);
}

// ---------------------------
// Event listeners
// ---------------------------
submit_btn.addEventListener("click", (e) => {
  e.preventDefault();

  // if invalid, show built-in error messages and stop
  if (!book_form.checkValidity()) {
    book_form.reportValidity(); // triggers the browser’s messages
    return;
  }

  const title = title_field.value;
  const author = author_field.value;
  const pages = pages_field.valueAsNumber;
  const read = read_check.checked;

  addBookToLibrary(title, author, pages, read);
  book_form.reset();
  saveLibrary();
  showLibrary();
});

new_book.addEventListener("click", () => {
  book_form.classList.toggle("active-form");
});
