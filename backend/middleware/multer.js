import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads/') // Make sure this directory exists
    },
    filename: function(req, file, callback) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
})

// File filter to accept both images and videos
const fileFilter = (req, file, callback) => {
    console.log(`Processing file: ${file.originalname}, size: ${file.size} bytes, mimetype: ${file.mimetype}`);
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        callback(null, true)
    } else {
        callback(new Error('Only image and video files are allowed!'), false)
    }
}

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit (increased for videos)
        files: 25 // Allow up to 25 files (5 variants × 4 images each + 5 videos)
    }
})

export default upload