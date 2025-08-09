# 🚀 RISUN Vercel Dashboard Setup Guide

## 🚨 **URGENT: Security Fix Required**

Your MongoDB credentials are currently exposed in your code. Follow this guide to secure them properly.

---

## 📋 **Step-by-Step Vercel Dashboard Setup**

### **1. Access Your Vercel Dashboard**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sign in with your GitHub account
3. You should see your deployed projects:
   - `risun` (Frontend)
   - `risun-backend` (Backend)

### **2. Configure Backend Environment Variables**

#### **Navigate to Backend Project:**
1. Click on your `risun-backend` project
2. Go to **Settings** tab
3. Click on **Environment Variables** in the left sidebar

#### **Add These Environment Variables:**

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://daniyashm2022:JM3tLZuAg8pHbXdc@organizations.khdfp.mongodb.net/?retryWrites=true&w=majority&appName=organizations` | Production, Preview, Development |
| `JWT_SECRET` | `risun_jwt_secret_key_2024_secure_token_for_authentication` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

#### **How to Add Each Variable:**
1. Click **Add New** button
2. Enter the **Name** (e.g., `MONGODB_URI`)
3. Enter the **Value** (your MongoDB connection string)
4. Select **All Environments** (Production, Preview, Development)
5. Click **Save**

### **3. Configure Frontend Environment Variables**

#### **Navigate to Frontend Project:**
1. Click on your `risun` project (frontend)
2. Go to **Settings** tab
3. Click on **Environment Variables**

#### **Add This Environment Variable:**

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_REACT_APP_SERVER_DOMAIN` | `https://risun-backend.vercel.app` | Production, Preview, Development |

### **4. Redeploy Both Projects**

After adding environment variables, you need to redeploy:

#### **Backend Redeploy:**
1. Go to your `risun-backend` project
2. Click on **Deployments** tab
3. Find the latest deployment
4. Click the **⋯** (three dots) menu
5. Select **Redeploy**
6. Confirm the redeploy

#### **Frontend Redeploy:**
1. Go to your `risun` project
2. Click on **Deployments** tab
3. Find the latest deployment
4. Click the **⋯** (three dots) menu
5. Select **Redeploy**
6. Confirm the redeploy

---

## 🔐 **Security Improvements**

### **1. Generate a Secure JWT Secret**
Replace the simple JWT secret with a more secure one:

```bash
# Generate a secure random string (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the output as your `JWT_SECRET` value.

### **2. MongoDB Security Best Practices**
1. **Create a dedicated database user** for your application
2. **Restrict IP access** in MongoDB Atlas to your Vercel deployment regions
3. **Use environment variables** (which we've now implemented)

### **3. Update MongoDB Connection String**
Consider creating a new MongoDB user specifically for production:

1. Go to MongoDB Atlas Dashboard
2. Database Access → Add New Database User
3. Create user: `risun-prod` with a strong password
4. Update your `MONGODB_URI` with the new credentials

---

## 🧪 **Testing Your Setup**

### **1. Check Environment Variables**
After redeployment, test if environment variables are working:

1. Go to your backend project
2. Click on **Functions** tab
3. Look for any error logs related to database connection

### **2. Test API Endpoints**
Run the verification script:
```bash
node verify-deployment.js
```

### **3. Test Full Application Flow**
1. Visit `https://risun.vercel.app`
2. Try to register a new user
3. Test login functionality
4. Try adding a location
5. Test weather data fetching

---

## 🔍 **Troubleshooting Common Issues**

### **Environment Variables Not Working**
- ✅ Make sure you selected **All Environments** when adding variables
- ✅ Redeploy after adding environment variables
- ✅ Check for typos in variable names
- ✅ Ensure no extra spaces in values

### **Database Connection Issues**
- ✅ Verify MongoDB Atlas cluster is running
- ✅ Check IP whitelist in MongoDB Atlas
- ✅ Verify connection string format
- ✅ Test connection string locally first

### **CORS Issues**
- ✅ Ensure backend CORS includes your frontend domain
- ✅ Check that both deployments are using HTTPS
- ✅ Verify environment variables are loaded correctly

### **Function Timeout Issues**
- ✅ Vercel serverless functions have a 10-second timeout on Hobby plan
- ✅ Optimize database queries for faster response
- ✅ Consider upgrading to Pro plan for longer timeouts

---

## 📊 **Monitoring Your Deployment**

### **1. Vercel Analytics**
Enable analytics for both projects:
1. Go to project settings
2. Click on **Analytics**
3. Enable **Web Analytics**

### **2. Function Logs**
Monitor your backend functions:
1. Go to `risun-backend` project
2. Click on **Functions** tab
3. Monitor logs for errors or performance issues

### **3. Performance Monitoring**
1. Check **Speed Insights** in Vercel dashboard
2. Monitor **Core Web Vitals**
3. Set up **Error Tracking** if needed

---

## 🚀 **Advanced Configuration**

### **1. Custom Domains (Optional)**
If you want custom domains:
1. Go to project **Settings**
2. Click on **Domains**
3. Add your custom domain
4. Update DNS records as instructed

### **2. Team Collaboration**
Add team members:
1. Go to project **Settings**
2. Click on **Members**
3. Invite team members with appropriate permissions

### **3. Deployment Protection**
For production security:
1. Enable **Deployment Protection** in settings
2. Set up **Password Protection** if needed
3. Configure **Preview Deployments** settings

---

## ✅ **Final Verification Checklist**

After completing all steps:

- [ ] Backend environment variables added and saved
- [ ] Frontend environment variables added and saved
- [ ] Both projects redeployed successfully
- [ ] Database connection working (no errors in function logs)
- [ ] User registration/login working
- [ ] Location management working
- [ ] Weather data fetching working
- [ ] ML model predictions working
- [ ] No console errors in browser
- [ ] All API calls returning expected responses

---

## 🆘 **Need Help?**

### **Vercel Support Resources**
- [Vercel Documentation](https://vercel.com/docs)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

### **MongoDB Atlas Support**
- [Connection String Guide](https://docs.mongodb.com/manual/reference/connection-string/)
- [Network Access Setup](https://docs.atlas.mongodb.com/security/ip-access-list/)

### **Quick Debug Commands**
```bash
# Test your deployment
node verify-deployment.js

# Check if environment variables are loaded (add to your backend temporarily)
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not Set');
console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not Set');
```

---

## 🎉 **You're All Set!**

Once you complete these steps, your RISUN platform will be:
- ✅ Securely configured with environment variables
- ✅ Properly connected to MongoDB Atlas
- ✅ Ready for production use
- ✅ Scalable and maintainable

Your AI-powered solar operations platform is ready to help users optimize their solar installations! 🌞⚡