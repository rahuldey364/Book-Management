const booksModel = require("../models/booksModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
// const ISBN = require( 'isbn-validate' );
const validator = require("isbn-validate")
const mongoose = require("mongoose")
const moment = require("moment")
const jwt = require("jsonwebtoken")

const isvalid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};
const isValidNumber = function (number) {
    if (typeof number === NaN || number === 0) return false;
    return true
}

const isvalidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0;
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}



let createBook = async function (req, res) {
    try {

        let requiredBody = req.body;

        if (!isvalidRequestBody(requiredBody)) {
            return res.send({ status: false, msg: "please provide  details" })
        }

        let { title, excerpt, userId, ISBN, category, subcategory, isDeleted, reviews, releasedAt } = req.body

        if (isDeleted) { if (isDeleted == true) { return res.status(400).send({ status: false, msg: "data is not vailid" }) } }

        if (!isvalid(title)) {
            return res.status(400).send({ status: false, msg: "title is required" })
        }
        let uniqueTitle = await booksModel.findOne({ title: title })
        if (uniqueTitle) return res.status(409).send({ status: false, msg: " title already exists" })

        if (!isvalid(excerpt)) {
            return res.status(400).send({ status: false, msg: "Name is required" })
        }


        if (!isValidObjectId(userId)) {
            return res.status(400).send({
                status: false,
                msg: "not a valid userId"
            })
        }

        let pattern1 = /^[\d*\-]{10}|[\d*\-]{13}$/

        if (!pattern1.test(ISBN)) { return res.status(400).send({ status: false, message: "ISBN is not valid" }) }

        // let validISBNFormat = await validator.Validate(ISBN);
        // if (!validISBNFormat) {
        //   return res.status(400).send({ status: false, msg: "Invalid ISBN" });
        // }
        let uniqueISBN = await booksModel.findOne({ ISBN: ISBN })
        if (uniqueISBN) return res.status(409).send({ status: false, msg: " ISBN already exists" })

        if (!isvalid(category)) {
            return res.status(400).send({ status: false, msg: "category is required" })
        }
        if (subcategory) {
            for (let i = 0; i < subcategory.length; i++) {
                if (!isvalid(subcategory[i])) { return res.status(400).send({ status: false, message: "subategory is not valid" }) }
            }
        }

        if (!isValidNumber(reviews)) {
            return res.status(400).send({ status: false, msg: "number is required" })
        }

        let check = /^(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(\/|-|\.)0?2\3(?:29)$/
        if (releasedAt) { if (!check.test(releasedAt)) { return res.status(409).send({ status: false, msg: " date must be in yyyy-mm-dd" }) } }

        if (!releasedAt) { req.body.releasedAt = new Date().toISOString().slice(0, 10); }


        req.body.releasedAt = moment().format('YYYY-MM-DD')
        let userData = await booksModel.create(req.body)
        return res.status(201).send({ status: true, data: userData })
    }
    catch (err) {
        return res.status(500).send({ err: err.message })

    }
}






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
        let getBooks = await booksModel.find({ isDeleted: false, ...data }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
        if (!getBooks) {
            return req.status(404).send({ status: false, msg: "Documents not found" })
        }
        else{
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




// GET /books/:bookId

// Returns a book with complete details including reviews. Reviews array would be in the form of Array. Response example here
// Return the HTTP status 200 if any documents are found. The response structure should be like this
// If the book has no reviews then the response body should include book detail as shown here and an empty array for reviewsData.
// If no documents are found then return an HTTP status 404 with a response like this

const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, msg: "BookId is required in params" })
        let check = await booksModel.findById({ _id: bookId })
        if (!check) return res.status(404).send({ status: false, msg: "No book found" })
        let check1 = await reviewModel.find({ bookId: check._id })
        if (check1.length > 0) {
            let Data = {
                title: check.title,
                excerpt: check.excerpt,
                userId: check,
                category: check.category,
                subcategory: check.subcategory,
                deleted: check.isDeleted,
                reviewsData: [check1]
            }
            return res.status(200).send({ status: true, data: Data });
        }
        else {
            let Data = {
                title: check.title,
                excerpt: check.excerpt,
                userId: check,
                category: check.category,
                subcategory: check.subcategory,
                deleted: check.isDeleted,
                reviewsData: []
            }
            return res.status(200).send({ status: true, data: Data });

        }

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: "error", err: err.message })

    }
}



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
        let data = req.body
        if (!data) return res.status(400).send({ status: false, msg: "BookId is required in params" })
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



// DELETE /books/:bookId

// Check if the bookId exists and is not deleted. If it does, mark it deleted and return an HTTP status 200 with a response body with status and message.
// If the book document doesn't exist then return an HTTP status of 404 with a body like this

const deleteBooksbyId = async function(req ,res){
    try {
        const bookId = req.params.bookId
        if(!bookId) return res.status(400).send({status : false, msg : "BookId should be present in params"})
        let check = await booksModel.findOne({ _id : bookId})
        let checking = check.isDeleted
        if(checking == true) return res.status(404).send({status : false,msg : "Already deleted"})
        if(checking == false){
        let deleteBlog = await booksModel.findOneAndUpdate({ _id: bookId }, {$set :{ isDeleted: true, deletedAt: new Date() }}, { new: true, upsert : true }) // we can change new Date() to moment().format()
            res.status(200).send({ status:true,msg: "book is deleted successfully" })
        } 
    }
    catch(err){
        console.log(err)
        res.status(500).send({ status: false, msg: "error", err: err.message })
    }
}










module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.getBookById = getBookById
module.exports.updateBooks = updateBooks
module.exports.deleteBooksbyId = deleteBooksbyId
