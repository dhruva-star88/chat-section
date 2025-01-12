import express from "express";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { MongoClient, GridFSBucket } from "mongodb"
import { addMessage, getFile, getMessages } from "../Controllers/MessageController.js"

const router = express.Router()

// Creating a storage Engine
// const storage = new GridFsStorage({
//     url:'mongodb://localhost:27017/',
//     file:(req, file) => {
//         console.log("Uploading file:", file);
//         return{
//             bucketName:'uploads',
//             filename:`${Date.now()}-${file.originalname}`,
//         }
//     }
// })

// const upload = multer({ storage });
const mongoURI = 'mongodb://localhost:27017/'
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create MongoDB client and connect
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' }); 
});


// Post method to upload the file top mongo-db
router.post("/", upload.single('attachment') ,addMessage)
router.get("/:chatId", getMessages)

// Route to get the file (attachment)
router.get('/file/:filename', getFile);

export default router
