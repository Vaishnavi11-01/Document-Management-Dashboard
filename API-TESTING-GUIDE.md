# API Testing Guide - Document Dashboard

## 🚀 Setup Instructions

### 1. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### 2. Start Server
```bash
cd server
npm install
npm run dev
```

### 3. Import Postman Collection
1. Open Postman
2. Click "Import"
3. Select `postman-collection.json` file
4. The collection will be imported with all API endpoints

## 📋 Test Scenarios

### ✅ Metadata Verification Tests

#### Test 1: Single File Upload
**Endpoint:** `POST /api/upload/single`
**Method:**
1. Select "Upload Single File" request
2. Go to Body → form-data
3. Add key: `file`, type: `file`
4. Select a PDF file (max 10MB)
5. Send request

**Expected Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "_id": "...",
    "filename": "unique-filename.pdf",
    "originalName": "your-file.pdf",
    "fileSize": 1234567,
    "mimeType": "application/pdf",
    "uploadPath": "/path/to/file",
    "status": "completed",
    "uploadProgress": 100,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Test 2: Multiple File Upload (Bulk Upload)
**Endpoint:** `POST /api/upload/multiple`
**Method:**
1. Select "Upload Multiple Files" request
2. Add 4+ PDF files to test bulk upload notification
3. Send request

**Expected Response:**
```json
{
  "message": "Files uploaded successfully",
  "files": [...],
  "totalFiles": 4,
  "isBulkUpload": true
}
```

#### Test 3: Verify Metadata in MongoDB
**Check MongoDB:**
```javascript
// Connect to MongoDB
use document-dashboard
db.files.find().pretty()

// Expected metadata fields:
{
  "_id": ObjectId("..."),
  "filename": "unique-filename.pdf",
  "originalName": "original-name.pdf",
  "fileSize": 1234567,
  "mimeType": "application/pdf",
  "uploadPath": "/server/uploads/unique-filename.pdf",
  "status": "completed",
  "uploadProgress": 100,
  "uploadedBy": "anonymous",
  "tags": [],
  "description": "",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### 📊 File Management Tests

#### Test 4: Get All Files
**Endpoint:** `GET /api/files`
**Expected Response:** Paginated list of files with metadata

#### Test 5: Get File Statistics
**Endpoint:** `GET /api/files/stats/summary`
**Expected Response:**
```json
{
  "totalFiles": 5,
  "totalSize": 5432109,
  "recentFiles": 2
}
```

### 🔔 Notification Tests

#### Test 6: Get Notifications
**Endpoint:** `GET /api/notifications`
**Expected Response:** List of upload notifications

#### Test 7: Get Unread Count
**Endpoint:** `GET /api/notifications/unread-count`
**Expected Response:** `{ "unreadCount": 3 }`

#### Test 8: Mark as Read
**Endpoint:** `PUT /api/notifications/:id/read`
**Expected Response:** Updated notification object

## 🧪 Advanced Tests

### Test 9: File Download
**Endpoint:** `GET /api/files/download/:filename`
**Method:** Use filename from previous upload response

### Test 10: Error Handling
**Test scenarios:**
- Upload non-PDF file (should return error)
- Upload file > 10MB (should return error)
- Request non-existent file (404 error)
- Invalid notification ID (404 error)

## 📱 Real-time Testing

### Test 11: Socket.IO Connection
1. Open browser console
2. Connect to WebSocket:
```javascript
const socket = io('http://localhost:5000');
socket.on('new-notification', (data) => {
  console.log('New notification:', data);
});
socket.on('upload-progress', (data) => {
  console.log('Upload progress:', data);
});
```

## ✅ Success Criteria

- [ ] Single file upload saves complete metadata
- [ ] Bulk upload triggers background processing notification
- [ ] File metadata includes all required fields
- [ ] MongoDB stores file information correctly
- [ ] Notifications are created for upload events
- [ ] Real-time updates work via Socket.IO
- [ ] File download works correctly
- [ ] Error handling works as expected

## 🐛 Troubleshooting

### Common Issues:
1. **MongoDB Connection Error**: Ensure MongoDB is running
2. **File Upload Error**: Check file size and type (PDF only, max 10MB)
3. **Permission Error**: Ensure uploads directory exists and is writable
4. **Socket.IO Error**: Check CORS settings in server.js

### Debug Commands:
```bash
# Check MongoDB collections
mongo document-dashboard
show collections
db.files.count()
db.notifications.count()

# Check server logs
npm run dev

# Check uploaded files
ls -la server/uploads/
```

## 📝 Test Results Template

```
✅ Single File Upload - PASSED
✅ Multiple File Upload - PASSED  
✅ Metadata Storage - PASSED
✅ File Retrieval - PASSED
✅ Notifications - PASSED
✅ Real-time Updates - PASSED
❌ Error Handling - FAILED (reason: ...)
```
