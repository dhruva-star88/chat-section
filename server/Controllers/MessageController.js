import express from 'express';
import multer from 'multer';
import { Readable } from 'stream'; 
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import MessageModel from "../Models/MessageModel.js";
import Grid from 'gridfs-stream';

// MongoDB connection setup
const conn = mongoose.connection;
let gfs, bucket;

// Initialize GridFS connection
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);  // Use mongoose.mongo for GridFS
  gfs.collection('uploads');
  console.log("GridFS Connection established and 'uploads.files' collection selected");
  bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
});

// Add message with optional attachment
export const addMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const file = req.file ? req.file : null;

    console.log("Received File:", req.file);  // Log file details

    if (file) {
        // Create a Readable stream from the file buffer
        const readableStream = new Readable();
        readableStream.push(file.buffer);  // Push the file buffer into the stream
        readableStream.push(null);  // End the stream

        const uploadStream = gfs.createWriteStream({
            filename: file.originalname,
            contentType: file.mimetype,
            _id: new mongoose.Types.ObjectId()  // Use mongoose.Types.ObjectId() instead of grid.mongo.ObjectID()
        });

        readableStream.pipe(uploadStream)
            .on('finish', async () => {
                const fileId = uploadStream.id;  // Get the file ID after the upload finishes
                console.log("File uploaded successfully with ID:", fileId);

                const message = new MessageModel({
                    chatId,
                    senderId,
                    text,
                    attachment: fileId,  // Store the file ID in the message
                });

                try {
                    const result = await message.save();
                    res.status(200).json(result);
                } catch (error) {
                    res.status(500).json(error);
                }
            })
            .on('error', (err) => {
                console.error('Error uploading file:', err);
                res.status(500).send('Error uploading file');
            });
    } else {
        const message = new MessageModel({
            chatId,
            senderId,
            text,
        });
        try {
            const result = await message.save();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

// Retrieve a specific file
export const getFile = (req, res) => {
    const { filename } = req.params;
  
    // Use GridFSBucket to find the file by filename
    const downloadStream = bucket.openDownloadStreamByName(filename);
  
    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });
  
    downloadStream.on('end', () => {
      res.end();
    });
  
    downloadStream.on('error', (err) => {
      console.error('Error retrieving file:', err);
      res.status(500).send('Error retrieving file');
    });
  };

// Get all messages for a specific chat
export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
