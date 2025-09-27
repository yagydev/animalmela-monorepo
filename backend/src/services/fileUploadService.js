const AWS = require('aws-sdk');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger');

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// Image processing options
const imageOptions = {
  pet: {
    width: 800,
    height: 600,
    quality: 80,
    format: 'jpeg'
  },
  avatar: {
    width: 200,
    height: 200,
    quality: 85,
    format: 'jpeg'
  },
  thumbnail: {
    width: 150,
    height: 150,
    quality: 75,
    format: 'jpeg'
  }
};

// Process image
const processImage = async (buffer, options = imageOptions.pet) => {
  try {
    const processedImage = await sharp(buffer)
      .resize(options.width, options.height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: options.quality })
      .toBuffer();

    return processedImage;
  } catch (error) {
    logger.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
};

// Upload to S3
const uploadToS3 = async (file, folder = 'uploads', options = imageOptions.pet) => {
  try {
    let fileBuffer = file.buffer;
    let fileExtension = 'jpg';
    let mimeType = 'image/jpeg';

    // Process image if it's an image file
    if (file.mimetype.startsWith('image/')) {
      fileBuffer = await processImage(file.buffer, options);
      fileExtension = options.format || 'jpg';
      mimeType = `image/${fileExtension}`;
    }

    // Generate unique filename
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    // S3 upload parameters
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read',
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString()
      }
    };

    // Upload to S3
    const result = await s3.upload(uploadParams).promise();

    logger.info(`File uploaded to S3: ${result.Location}`);

    return {
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket,
      size: fileBuffer.length,
      mimeType
    };
  } catch (error) {
    logger.error('S3 upload error:', error);
    throw new Error('Failed to upload file');
  }
};

// Upload multiple files
const uploadMultipleFiles = async (files, folder = 'uploads', options = imageOptions.pet) => {
  try {
    const uploadPromises = files.map(file => uploadToS3(file, folder, options));
    const results = await Promise.all(uploadPromises);
    
    logger.info(`Multiple files uploaded: ${results.length} files`);
    return results;
  } catch (error) {
    logger.error('Multiple files upload error:', error);
    throw new Error('Failed to upload multiple files');
  }
};

// Delete from S3
const deleteFromS3 = async (key) => {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    await s3.deleteObject(deleteParams).promise();
    logger.info(`File deleted from S3: ${key}`);
    
    return true;
  } catch (error) {
    logger.error('S3 delete error:', error);
    throw new Error('Failed to delete file');
  }
};

// Get signed URL for upload
const getSignedUploadUrl = async (fileName, contentType, folder = 'uploads') => {
  try {
    const key = `${folder}/${uuidv4()}-${fileName}`;
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: contentType,
      Expires: 300 // 5 minutes
    };

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    
    return {
      signedUrl,
      key,
      url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    };
  } catch (error) {
    logger.error('Signed URL generation error:', error);
    throw new Error('Failed to generate signed URL');
  }
};

// Get signed URL for download
const getSignedDownloadUrl = async (key, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: expiresIn
    };

    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    return signedUrl;
  } catch (error) {
    logger.error('Signed download URL generation error:', error);
    throw new Error('Failed to generate signed download URL');
  }
};

// Upload pet photo with multiple sizes
const uploadPetPhoto = async (file) => {
  try {
    const results = {};

    // Upload original size
    results.original = await uploadToS3(file, 'pet-photos/original', {
      width: 1200,
      height: 900,
      quality: 90,
      format: 'jpeg'
    });

    // Upload medium size
    results.medium = await uploadToS3(file, 'pet-photos/medium', {
      width: 800,
      height: 600,
      quality: 80,
      format: 'jpeg'
    });

    // Upload thumbnail
    results.thumbnail = await uploadToS3(file, 'pet-photos/thumbnails', {
      width: 300,
      height: 300,
      quality: 75,
      format: 'jpeg'
    });

    return results;
  } catch (error) {
    logger.error('Pet photo upload error:', error);
    throw new Error('Failed to upload pet photo');
  }
};

// Upload user avatar
const uploadAvatar = async (file) => {
  try {
    const result = await uploadToS3(file, 'avatars', imageOptions.avatar);
    return result;
  } catch (error) {
    logger.error('Avatar upload error:', error);
    throw new Error('Failed to upload avatar');
  }
};

// Upload service photos
const uploadServicePhotos = async (files) => {
  try {
    const results = await uploadMultipleFiles(files, 'service-photos', {
      width: 800,
      height: 600,
      quality: 80,
      format: 'jpeg'
    });
    return results;
  } catch (error) {
    logger.error('Service photos upload error:', error);
    throw new Error('Failed to upload service photos');
  }
};

module.exports = {
  uploadToS3,
  uploadMultipleFiles,
  deleteFromS3,
  getSignedUploadUrl,
  getSignedDownloadUrl,
  uploadPetPhoto,
  uploadAvatar,
  uploadServicePhotos,
  processImage,
  imageOptions
};
