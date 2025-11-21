# Setup Guide - Restaurant Opportunity Score Analyzer

Complete step-by-step instructions to get the application running from scratch.

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Python 3.8+** (tested with Python 3.11.5)
- **pip** package manager
- **Modern web browser** (Chrome, Firefox, Safari, or Edge)
- **Internet connection** (for map visualizations)
- **2GB free disk space**
- **Terminal/Command line** access

### Check Your Python Version

```bash
python3 --version
# Should show: Python 3.x.x (where x >= 8)
```

---

## 🚀 Quick Setup (5 Minutes)

### Option 1: If Virtual Environment Already Exists

```bash
# Navigate to project directory
cd cse-6242-restaurant-selection

# Activate virtual environment
source venv/bin/activate

# Verify setup
python verify_setup.py

# Start backend API
python api.py
```

In a **new terminal**:
```bash
# Navigate to frontend directory
cd cse-6242-restaurant-selection/frontend

# Start frontend
python -m http.server 8080
```

**Open browser**: http://localhost:8080

---

## 🔧 Complete Setup (From Scratch)

### Step 1: Clone and Navigate to Project

```bash
# Clone the repository (if you haven't already)
git clone <repository-url>
cd cse-6242-restaurant-selection
```

### Step 2: Create Virtual Environment (If Needed)

```bash
# Create venv
python3 -m venv venv

# Activate it
# Mac/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

### Step 3: Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install all requirements
pip install -r requirements.txt
```

**What gets installed**:
- fastapi - Web framework
- uvicorn - ASGI server
- pandas - Data processing
- numpy - Numerical operations
- xgboost - Machine learning model
- joblib - Model persistence
- pydantic - Data validation
- python-multipart - File upload support

### Step 4: Verify Setup

```bash
python verify_setup.py
```

**Expected output**:
```
✓ API Server
✓ Constants Module
✓ Restaurant Data
✓ ML Model
✓ Requirements File
✓ Model Directory
✓ Frontend HTML
✓ Frontend JavaScript
✓ Frontend README
✅ All essential checks passed!
```

If any checks fail, see [Troubleshooting](#-troubleshooting) section.

### Step 5: Start Backend API

```bash
# Make sure venv is activated (you should see (venv) in prompt)
python api.py
```

**Expected output**:
```
Loading model and data...
✓ Model loaded from model/xgboost_untuned_model.pkl
✓ Data loaded: (65168, 127)
✓ Context lookup created for 814 zip codes
✓ Constants loaded: 21 subtypes, 814 zip codes
✓ Startup complete!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Keep this terminal open!** The API must stay running.

### Step 6: Test the API (Optional but Recommended)

Open a **new terminal**:

```bash
cd cse-6242-restaurant-selection
source venv/bin/activate
python test_api.py
```

**Expected output**:
```
✅ Integration tests complete!
```

### Step 7: Start Frontend Server

In a **new terminal** (keep API running in first terminal):

```bash
cd cse-6242-restaurant-selection/frontend
python -m http.server 8080
```

**Expected output**:
```
Serving HTTP on :: port 8080 (http://[::]:8080/) ...
```

### Step 8: Open the Application

Open your web browser and go to:

**http://localhost:8080**

You should see the Restaurant Opportunity Score Analyzer interface!

---

## 🎯 Verification Checklist

After setup, verify everything works:

- [ ] Backend API responds at http://localhost:8000
- [ ] API docs load at http://localhost:8000/docs
- [ ] Frontend loads at http://localhost:8080
- [ ] Dropdowns populate with cities, types, and prices
- [ ] "Analyze Opportunity" button is clickable
- [ ] Clicking button shows loading spinner
- [ ] Results display after 3-5 seconds
- [ ] Map or list view shows ZIP code scores
- [ ] Statistics dashboard shows metrics

---

## 📖 Using the Application

### Basic Workflow

1. **Select a City**
   - Click dropdown
   - Choose from 10 cities (e.g., "Philadelphia, PA")

2. **Choose Restaurant Type**
   - Click dropdown
   - Select cuisine (e.g., "Italian")

3. **Pick Price Range**
   - Click dropdown
   - Choose $ to $$$$ (e.g., "$$")

4. **Analyze**
   - Click "Analyze Opportunity" button
   - Wait 3-5 seconds

5. **Review Results**
   - View statistics at top
   - Explore map (default) or switch to list view
   - Hover over ZIP codes for details

### Understanding the Results

**Opportunity Score**: Percentage (0-100%) representing 5-year survival probability

| Score Range | Color | Rating | Recommendation |
|-------------|-------|--------|----------------|
| 80-100% | Dark Green | Very High | Excellent location - Prime spot |
| 70-80% | Green | High | Strong opportunity - Recommended |
| 60-70% | Light Green | Above Average | Good opportunity |
| 50-60% | Yellow | Average | Moderate - Be careful |
| 40-50% | Orange | Below Average | Challenging - Higher risk |
| 30-40% | Orange-Red | Low | Limited opportunity |
| 0-30% | Red | Very Low | Not recommended |

### Example Scenarios

**Scenario 1: Opening a mid-priced Italian restaurant**
- City: Philadelphia, PA
- Type: Italian
- Price: $$ (Moderate)
- Result: ~71 ZIP codes, scores range 20-93%

**Scenario 2: Budget Mexican restaurant**
- City: Tampa, FL
- Type: Mexican
- Price: $ (Budget)
- Result: ~46 ZIP codes, average score ~54%

**Scenario 3: Upscale American restaurant**
- City: Nashville, TN
- Type: American
- Price: $$$ (Upscale)
- Result: ~36 ZIP codes, highest score ~90%

---

## 🛑 Stopping the Application

When you're done:

### Method 1: Graceful Shutdown

1. Go to terminal running frontend
   - Press `Ctrl+C`

2. Go to terminal running API
   - Press `Ctrl+C`

### Method 2: Force Kill (if needed)

```bash
# Kill API (port 8000)
lsof -ti:8000 | xargs kill -9

# Kill Frontend (port 8080)
lsof -ti:8080 | xargs kill -9
```

---

## 🔍 Troubleshooting

### Problem: "Command not found: python"

**Solution**: Try `python3` instead of `python`

```bash
python3 api.py
python3 -m http.server 8080
```

### Problem: "Module not found: fastapi/pandas/xgboost"

**Solution**: Install dependencies

```bash
# Make sure venv is activated
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### Problem: "Address already in use (port 8000)"

**Cause**: API is already running

**Solution 1**: Use the existing API (no action needed)

**Solution 2**: Kill the process
```bash
lsof -ti:8000 | xargs kill -9
python api.py
```

### Problem: "Address already in use (port 8080)"

**Cause**: Frontend is already running

**Solution**: Kill the process
```bash
lsof -ti:8080 | xargs kill -9
cd frontend
python -m http.server 8080
```

### Problem: Frontend loads but "Failed to fetch opportunity scores"

**Cause**: Backend API not running

**Solution**: 
```bash
# Check if API is running
curl http://localhost:8000/

# If no response, start it
python api.py
```

### Problem: Map doesn't load, only see list view

**Cause**: Internet connection issue or GeoJSON loading failure

**Solution**: 
- Check internet connection
- Use list view (it works offline)
- Check browser console (F12) for errors

### Problem: "Model file not found"

**Cause**: Missing ML model file

**Solution**: Ensure `model/xgboost_untuned_model.pkl` exists
```bash
ls -lh model/xgboost_untuned_model.pkl
```

### Problem: "Data file not found"

**Cause**: Missing dataset

**Solution**: Ensure `restaurant_row_data.csv` exists
```bash
ls -lh restaurant_row_data.csv
```

### Problem: Dropdowns are empty

**Cause**: JavaScript not loading or API not responding

**Solution**:
1. Check browser console (F12)
2. Verify API is running: http://localhost:8000
3. Check `frontend/app.js` exists
4. Try different browser

### Problem: "CORS error" in browser console

**Cause**: API CORS settings issue

**Solution**: API already has CORS enabled. Check if API is running on correct port (8000)

---

## 🧪 Testing the Setup

### Quick API Test

```bash
# Health check
curl http://localhost:8000/

# Test prediction
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Philadelphia",
    "state": "PA",
    "subtype": "Italian",
    "price_range": 2.0
  }'
```

### Comprehensive Test

```bash
python test_api.py
```

Should output:
```
✅ Integration tests complete!
```

---

## 📁 Project Structure

Understanding the file layout:

```
cse-6242-restaurant-selection/
├── api.py                          # Backend API server
├── constants.py                    # City/ZIP mappings
├── restaurant_row_data.csv         # Dataset (65k rows)
├── requirements.txt                # Python dependencies
├── verify_setup.py                 # Setup checker
├── test_frontend_integration.py    # Integration tests
│
├── model/
│   └── xgboost_untuned_model.pkl   # Trained ML model
│
├── frontend/
│   ├── index.html                  # Web interface
│   ├── app.js                      # Frontend logic
│   └── README.md                   # Frontend docs
│
└── venv/                           # Virtual environment
```

---

## 🔄 Restarting After System Reboot

If you restart your computer or open a new terminal session:

```bash
# 1. Navigate to project
cd cse-6242-restaurant-selection

# 2. Activate venv
source venv/bin/activate

# 3. Start backend (Terminal 1)
python api.py

# 4. Start frontend (Terminal 2 - new window)
cd frontend
python -m http.server 8080

# 5. Open browser
# Go to http://localhost:8080
```

---

## 🌐 Accessing from Other Devices (Optional)

To access from other devices on same network:

### Step 1: Find Your IP Address

```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Or
ipconfig getifaddr en0
```

### Step 2: Update Frontend Configuration

Edit `frontend/app.js`, line 6:
```javascript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8000';
```

### Step 3: Access from Other Device

Open browser on other device:
```
http://YOUR_IP_ADDRESS:8080
```

**Note**: Firewall may block access. You may need to allow ports 8000 and 8080.

---

## 🚀 Advanced Configuration

### Changing Ports

**API Port** (default 8000):
Edit `api.py`, last line:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)  # Change to 8001
```

**Frontend Port** (default 8080):
```bash
python -m http.server 9000  # Change to 9000
```

Don't forget to update API_BASE_URL in `frontend/app.js`!

### Running in Background

**Backend**:
```bash
nohup python api.py > api.log 2>&1 &
```

**Frontend**:
```bash
cd frontend
nohup python -m http.server 8080 > frontend.log 2>&1 &
```

### Custom Styling

Edit CSS in `frontend/index.html` within `<style>` tags:
- Change colors
- Adjust layout
- Modify fonts

---

## 📚 Additional Resources

- **API Documentation**: http://localhost:8000/docs (when API running)
- **Frontend Docs**: `frontend/README.md`
- **Feature List**: `frontend/FEATURES.md`
- **Project Status**: `STATUS_UPDATE.md`

---

## 🎓 For Presentation/Demo

### Pre-Demo Checklist

1. [ ] Both servers running
2. [ ] Tested one example successfully
3. [ ] Browser window ready at http://localhost:8080
4. [ ] Example scenarios prepared
5. [ ] Know which cities to demo

### Demo Script

1. **Introduction** (30 seconds)
   - "This is our Restaurant Opportunity Score Analyzer"
   - "Predicts 5-year survival probability for restaurants"

2. **Show Interface** (30 seconds)
   - Point out the three dropdowns
   - Explain the parameters

3. **Live Demo** (1-2 minutes)
   - Select: Philadelphia, Italian, $$
   - Click Analyze
   - Show statistics
   - Explore map (zoom, hover)
   - Switch to list view

4. **Explain Results** (1 minute)
   - Color coding
   - Top ZIP codes
   - Practical applications

### Backup Plan

If live demo fails:
- Screenshots in `Visualizations/Philly Trial/Example Pictures/`
- Can show static maps
- API documentation at /docs

---

## ✅ Success Criteria

You're ready when:

- [x] API starts without errors
- [x] Frontend loads in browser
- [x] Can select all three parameters
- [x] Button clicks successfully
- [x] Results appear in 3-5 seconds
- [x] Can view both map and list
- [x] Tests pass: `python test_frontend_integration.py`

---

## 📞 Getting Help

1. **Check logs**:
   - API: Check terminal running `python api.py`
   - Frontend: Check browser console (F12)

2. **Run diagnostics**:
   ```bash
   python verify_setup.py
   ```

3. **Check specific issues**:
   - API health: http://localhost:8000
   - API docs: http://localhost:8000/docs
   - Frontend: View page source

4. **Review documentation**:
   - This file (SETUP.md)
   - STATUS_UPDATE.md
   - frontend/README.md

---

## 🎉 You're All Set!

If you've followed all steps:
- ✅ Backend is running on port 8000
- ✅ Frontend is running on port 8080
- ✅ Application is accessible at http://localhost:8080

**Start using the application and explore restaurant opportunities!**

---

*Last Updated: November 21, 2025*  
*For: CSE 6242 Team 022*

