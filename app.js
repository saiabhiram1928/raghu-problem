const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Books = require('./models/books')
const {notFound , errorHandler} = require("./error_handler")
const mongo_uri = "mongodb+srv://benny:ZLeywBCdV1aybO9s@cluster0.6vovitk.mongodb.net/raghu";

mongoose.connect(mongo_uri, {
  useNewurlParser: true,
});
mongoose.connection
  .once("open", () => {
    console.log("db connected");
  })
  .on("error", (err) => {
    console.error(err);
  });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("library management system api server");
});

//@desc   Fetch all books
//@route  GET /api/books
app.get('/api/books' ,async(req,res)=>{
    try {
        const data = await Books.find();
        console.log(data)
        res.status(200).json(data);
    } catch (err) {
        res.status(500)
        throw new Error(err);
    }

})

//@desc   Add Book to the database
//@route  POST /api/books

app.post('/api/books', async (req, res) => {
    try {
      const { title, author, category, publish_date, copies_available, copies_total } = req.body;
  
      const newBook = new Books({
        title,
        author,
        category,
        publish_date,
        copies_available,
        copies_total
      });
  

      const savedBook = await newBook.save();

      res.status(201).json(savedBook,{msg:"Book Sucessfully Added"});
    } catch (err) {
      res.status(500);
      throw new Error(err);
    }
  });
  //@desc   Update Book in database
  //@route  PUT /api/books/:id
  app.put('/api/books/:id', async (req, res) => {
    try {
      const bookId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
      }
  
      const { title, author, category, publish_date, copies_available, copies_total } = req.body;
  
      const updatedBook = await Books.findByIdAndUpdate(
        bookId,
        {
          title,
          author,
          category,
          publish_date,
          copies_available,
          copies_total
        },
        { new: true }
      );
  
      // Check if the book was found or not
      if (!updatedBook) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      // Send the updated book as a response
      res.status(200).json(updatedBook, {msg : "Book Sucesfully Updated"});
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.use(notFound);
app.use(errorHandler);

const server = app.listen(5000, () => {
    console.log(`Server is Runnig at port:${5000}`);
  });
  
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error ocuured : ${err}`);
    server.close(() => process.exit(1));
  });