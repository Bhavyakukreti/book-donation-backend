const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// GET /books - Fetch paginated list of books
router.get("/books", async (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Get the current page (default to 1)
  const limit = parseInt(req.query.limit) || 10; // Number of books per page (default to 10)

  try {
    // Fetch books with pagination
    const books = await Book.find()
      .skip((page - 1) * limit)  // Skip books based on page number
      .limit(limit);  // Limit the number of books per page

    // Get total number of books for pagination calculation
    const totalBooks = await Book.countDocuments();

    res.status(200).json({
      books,
      totalPages: Math.ceil(totalBooks / limit), // Total number of pages
      currentPage: page, // Current page number
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Add a new book
router.post("/books/add", async (req, res) => {
  const { title, author, genre, year, isbn, imageUrl } = req.body;

  // Validate that all fields are provided
  if (!title || !author || !genre || !year || !isbn) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new book and save it to the database
    const newBook = new Book({ title, author, genre, year, isbn, imageUrl });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).json({ message: "Error adding book" });
  }
});

// Delete a book
router.delete("/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to find and delete the book by ID
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: "Error deleting book" });
  }
});

// Edit a book
router.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, year, isbn, imageUrl } = req.body;

  // Validate that all fields are provided
  if (!title || !author || !genre || !year || !isbn) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Attempt to find and update the book by ID
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, genre, year, isbn, imageUrl },
      { new: true } // Return the updated book
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ message: "Error updating book" });
  }
});

module.exports = router;
