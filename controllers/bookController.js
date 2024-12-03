const Book = require('../models/Book');

// Get All Books with Pagination
exports.getAllBooks = async (req, res) => {
    const { page = 1, limit = 6 } = req.query; // Default page is 1, limit is 6

    try {
        const totalBooks = await Book.countDocuments(); // Count the total number of books
        const books = await Book.find()
            .skip((page - 1) * limit)  // Skip the books that were already displayed
            .limit(parseInt(limit));  // Limit the number of books to the 'limit' value

        const totalPages = Math.ceil(totalBooks / limit); // Calculate total pages
        
        res.json({
            books,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};

// Add Book
exports.addBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: 'Failed to add book' });
    }
};

// Update Book
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(book);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update book' });
    }
};

// Delete Book
exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete book' });
    }
};
