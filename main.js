document.addEventListener("DOMContentLoaded", function () {
  let books = [];
  const STORAGE_KEY = "BOOKSHELF_APPS";
  const BOOK_FORM = document.getElementById("book-form");
  const searchBooksInput = document.getElementById("search-input");

  function addBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = parseInt(document.getElementById("year").value);
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    if (title.trim() === "" || author.trim() === "" || isNaN(year)) {
      alert("Silakan lengkapi informasi buku.");
      return;
    }

    const book = {
      id: +new Date(),
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };

    books.push(book);
    updateBookshelf(books);
    saveBooksToStorage();
    BOOK_FORM.reset();
  }

  function removeBook(bookId) {
    const bookIndex = books.findIndex((book) => book.id === bookId);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      updateBookshelf(books);
      saveBooksToStorage();
    }
  }

  function toggleComplete(bookId) {
    const book = books.find((book) => book.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      updateBookshelf(books);
      saveBooksToStorage();
    }
  }

  function updateBookshelf(booksToShow) {
    const uncompletedBooksList = document.getElementById("uncompleted-books");
    const completedBooksList = document.getElementById("completed-books");

    uncompletedBooksList.innerHTML = "";
    completedBooksList.innerHTML = "";

    booksToShow.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.classList.add("book");
      bookItem.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author} - ${book.year}</p>
      <div class="book-actions">
        <button class="btn-toggle btn-status" data-id="${book.id}">
          ${book.isComplete ? "Belum Selesai" : "Selesai"}
        </button>
        <button class="btn-remove btn-delete" data-id="${
          book.id
        }">Hapus</button>
      </div>
          `;

      if (book.isComplete) {
        completedBooksList.appendChild(bookItem);
      } else {
        uncompletedBooksList.appendChild(bookItem);
      }

      const toggleButton = bookItem.querySelector(".btn-toggle");
      toggleButton.addEventListener("click", () => {
        toggleComplete(book.id);
      });

      const removeButton = bookItem.querySelector(".btn-remove");
      removeButton.addEventListener("click", () => {
        removeBook(book.id);
      });
    });
  }

  function saveBooksToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  function loadBooksFromStorage() {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    if (storedBooks) {
      books = JSON.parse(storedBooks);
      updateBookshelf(books);
    }
  }

  BOOK_FORM.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });

  searchBooksInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const filteredBooks = searchBooks(query);
    updateBookshelf(filteredBooks);
  });

  function searchBooks(query) {
    return books.filter((book) => book.title.toLowerCase().includes(query));
  }

  loadBooksFromStorage();
});
