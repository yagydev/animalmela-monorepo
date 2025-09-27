import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const connectDB = require('../../../lib/mongodb');
const { User } = require('../../../models');
const { withAuth } = require('../../../lib/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware to handle file upload
const uploadMiddleware = upload.single('profilePic');

async function uploadProfilePicHandler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    try {
      const userId = req.user._id;
      const filePath = `/uploads/profiles/${req.file.filename}`;

      // Update user profile picture
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: filePath },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile picture uploaded successfully',
        profilePic: filePath
      });

    } catch (error) {
      console.error('Upload profile pic error:', error);
      
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to upload profile picture'
      });
    }
  });
}

export default withAuth(uploadProfilePicHandler);
