const booksModel = require("../models/booksModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const validation = require("../validation/validation")
const mongoose = require("mongoose")
const moment = require("moment")
const jwt = require("jsonwebtoken")





let createBook = async function (req, res) {
    try {

        let requiredBody = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, isDeleted, reviews, releasedAt } = req.body   // destructuring method 

//  -------------------------------VALIDATION BEGINS--------------------------------------------------------------------------------------------------------------------------------       

        if (!validation.isValidRequestBody(requiredBody)) {
            return res.send({ status: false, msg: "please provide  details" })
        }

        if (isDeleted) { if (isDeleted == true) { return res.status(400).send({ status: false, message: "data is not vailid" }) } }         // Imp condition to check

        if (!validation.isValid(title)) {                                                                                 // title validation
            return res.status(400).send({ status: false, message: "title is required and it should be valid" })
        }

        let uniqueTitle = await booksModel.findOne({ title: title })                                                      // title uniqueness
        if (uniqueTitle) return res.status(409).send({ status: false, message: " title already exists" })

        if (!validation.isValid(excerpt)) {                                                                               // excerpt validation
            return res.status(400).send({ status: false, message: "excerpt is required and it should be valid" })

        }

        if (!validation.isValidObjectId(userId)) {                                                                         // userId validation
            return res.status(400).send({
                status: false,
                message: "not a valid userId"
            })
        }

        let pattern1 = /^[\d*\-]{10}|[\d*\-]{13}$/                                                                          // ISBN validation
        if (!pattern1.test(ISBN)) { return res.status(400).send({ status: false, message: "ISBN is required and it should be valid" }) }

        let uniqueISBN = await booksModel.findOne({ ISBN: ISBN })                                                          // ISBN uniqueness
        if (uniqueISBN) return res.status(409).send({ status: false, msg: " ISBN already exists" })

        if (!validation.isValid(category)) {                                                                               // category validation
            return res.status(400).send({ status: false, msg: "category is required" })
        }

        if (subcategory) {                                                                                                 // subcategory validation
            for (let i = 0; i < subcategory.length; i++) {
                if (!validation.isValid(subcategory[i])) { return res.status(400).send({ status: false, message: "subategory is not valid" }) }
            }
        }

        if (!validation.isValidNumber(reviews)) {                                                                          // reviews validation
            return res.status(400).send({ status: false, msg: "number is required" })
        }

          if (!validation.isValid(releasedAt)) {
            return res
              .status(400)
              .send({ status: false, msg: "released date is required" });
          }
// -------------------------------------validation Ends-------------------------------------------------------------------------------------------------------------------------------          

        let check = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (releasedAt) {
            if (!check.test(releasedAt)) {
                // need to solve this later
                return res
                    .status(409)
                    .send({ status: false, msg: " date must be in yyyy-mm-dd" });
            }
        }

       let userData = await booksModel.create(req.body)
        return res.status(201).send({ status: true, data: userData })

    }
    catch (err) {
        return res.status(500).send({ err: err.message })

    }
}




// ==========================================================================================================================================================================================================================================

// GET /books
// Returns all books in the collection that aren't deleted. Return only book _id, title, excerpt, userId, category, releasedAt, reviews field. Response example here
// Return the HTTP status 400 if any documents are found. The response structure should be like this
// If no documents are found then return an HTTP status 404 with a response like this
// Filter books list by applying filters. Query param can have any combination of below filters.
// By userId
// By category
// By subcategory example of a query url: books?filtername=filtervalue&f2=fv2
// Return all books sorted by book name in Alphabatical order

const getBooks = async function (req, res) {
    try {
        let data = req.query
        
        if (!validation.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "please provide details" })
        }

        if (!validation.isValidObjectId(data.userId)) {
            return res.status(400).send({
                status: false,
                msg: "not a valid userId"
            })
        }

        if (!validation.isValid(data.category)) {
            return res.status(400).send({ status: false, msg: "category is required" })
        }

        let getBooks = await booksModel.find({ isDeleted: false, ...data }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
        if (!getBooks) {
            return req.status(404).send({ status: false, msg: "Documents not found" })
        }
        else {
            let arranged = getBooks.sort(function (a, b) {
                if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
                if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                return 0;
            })
            return res.status(200).send({ status: true, msg: "list of books", data: arranged })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: "error", err: err.message })

    }
}

// =============================================================================================================================================================================================================




// GET /books/:bookId

// Returns a book with complete details including reviews. Reviews array would be in the form of Array. Response example here
// Return the HTTP status 200 if any documents are found. The response structure should be like this
// If the book has no reviews then the response body should include book detail as shown here and an empty array for reviewsData.
// If no documents are found then return an HTTP status 404 with a response like this



const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) {
            return res.status(400).send({ status: false, message: "enter a Book Id  first", });
        }
        if (!validation.isValidObjectId(bookId)) {
            return res.status(404).send({
                status: false,
                message: "you have entered a invalid book id or book is deleted  ",
            });
        }
        const isValidBook = await booksModel.findOne({ _id: bookId, isDeleted: false }).lean(); //{ _Id}
        if (!isValidBook) {
            return res.status(404).send({
                status: false,
                message: "you have entered a invalid book id or book is deleted  ",
            });
        }
        const getReviews = await reviewModel.find({ bookId: bookId, isDeleted: false })

        delete isValidBook.ISBN
        isValidBook.reviewsData = getReviews
        res.status(200).send({ status: true, data: isValidBook });
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message });
    }
};

// =========================================================================================================================================================================================================================================



// PUT /books/:bookId

// Update a book by changing its
// title
// excerpt
// release date
// ISBN
// Make sure the unique constraints are not violated when making the update
// Check if the bookId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like this
// Return an HTTP status 200 if updated successfully with a body like this
// Also make sure in the response you return the updated book document.

const updateBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: "BookId is required in params" })
        if (!validation.isValidObjectId(bookId)) {
            return res.status(404).send({
                status: false,
                message: "you have entered a invalid book id or book is deleted  ",
            });
        }
        let data = req.body
        if (!data) return res.status(400).send({ status: false, message: "Data is not present in request body" })
        if (!validation.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "please provide details" })
        }
        if (!validation.isValid(data.title)) {
            return res.status(400).send({ status: false, msg: "title is not Valid" })
        }
        let uniqueTitle = await booksModel.findOne({ title: data.title })
        if (uniqueTitle) return res.status(409).send({ status: false, msg: " title already exists" })


        if (!validation.isValidNumber(data.ISBN)) {
            return res.status(400).send({ status: false, msg: "Invalid ISBN" });
        }
        let uniqueISBN = await booksModel.findOne({ ISBN: data.ISBN })
        if (uniqueISBN) return res.status(409).send({ status: false, msg: " ISBN already exists" })

        let updateBooks = await booksModel.findOneAndUpdate({ _id: bookId }, {
            $set: {
                title: data.title,
                excerpt: data.excerpt,
                releasedAt: data.releasedAt,
                ISBN: data.ISBN
            }
        }, { new: true, upsert: true })

        if (updateBooks.length == 0) {

            return res.status(404).send({ status: false, msg: "Invalid Request" })
        }
        else {
            res.status(200).send({ status: true, data: updateBooks })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: "error", err: err.message })
    }
}

// =============================================================================================================================================================================================================================================


// DELETE /books/:bookId

// Check if the bookId exists and is not deleted. If it does, mark it deleted and return an HTTP status 200 with a response body with status and message.
// If the book document doesn't exist then return an HTTP status of 404 with a body like this

const deleteBooksbyId = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, msg: "BookId should be present in params" })
        if (!validation.isValidObjectId(bookId)) {
            return res.status(404).send({
                status: false,
                message: "you have entered a invalid book id or book is deleted  ",
            });
        }
        let check = await booksModel.findById({ _id: bookId })
        if (!check) return res.status(400).send({ status: false, msg: "Books not found" })
        let checking = check.isDeleted
        if (checking == true) return res.status(404).send({ status: false, msg: "Already deleted" })
        if (checking == false) {
            let deleteBook = await booksModel.findOneAndUpdate({ _id: bookId },
                { $set: { isDeleted: true, deletedAt: new Date() } },
                { new: true, upsert: true })                                                        // we can change new Date() to moment().format()
            res.status(200).send({ status: true, msg: "book is deleted successfully" });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: "error", err: err.message })
    }
}

module.exports = { createBook, getBooks, getBookById, updateBooks, deleteBooksbyId }
