# MongoDB Setup Guide - Quick Fix for Signup Error

## Current Issue
The signup error is caused by MongoDB not running. Docker Desktop is having issues, so here are the easiest solutions:

## ✅ RECOMMENDED: MongoDB Atlas (Cloud - 2 minutes)

This is the **fastest and easiest** solution - no installation needed!

### Steps:

1. **Sign up for free MongoDB Atlas:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account (takes 30 seconds)

2. **Create a free cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"
   - Wait 2-3 minutes for cluster to be created

3. **Set up database access:**
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `comp3123user` (or any username)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Set up network access:**
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get connection string:**
   - Click "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

6. **Update backend/.env file:**
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://comp3123user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/comp3123_assignment2?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_change_in_production
   NODE_ENV=development
   ```
   - Replace `YOUR_PASSWORD` with the password you created
   - Replace `cluster0.xxxxx` with your actual cluster address
   - The database name `comp3123_assignment2` will be created automatically

7. **Restart backend server:**
   - Stop the current backend server (Ctrl+C in the PowerShell window)
   - Start it again:
     ```bash
     cd backend
     npm start
     ```

8. **Try signup again!** It should work now! 🎉

---

## Alternative: Fix Docker Desktop

If you prefer to use Docker:

1. **Close Docker Desktop completely**
2. **Kill all Docker processes:**
   ```powershell
   Get-Process -Name "*docker*" | Stop-Process -Force
   ```
3. **Restart Docker Desktop** from Start Menu
4. **Wait for Docker to fully start** (check system tray for whale icon)
5. **Start MongoDB:**
   ```bash
   docker-compose up -d mongodb
   ```
6. **Restart backend server**

---

## Alternative: Install MongoDB Locally

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download Windows installer
   - Run installer and follow setup wizard
   - Make sure to install as a Windows Service

2. **Start MongoDB Service:**
   - Open Services (services.msc)
   - Find "MongoDB" service
   - Right-click → Start

3. **Restart backend server**

---

## Verify MongoDB Connection

After setting up MongoDB, check the backend console. You should see:
```
MongoDB connected successfully
```

If you see connection errors, double-check:
- Connection string is correct
- Password doesn't have special characters that need URL encoding
- Network access is allowed (for Atlas)
- MongoDB service is running (for local install)

---

## Quick Test

Once MongoDB is connected, try signing up again. The error should be gone! ✅

