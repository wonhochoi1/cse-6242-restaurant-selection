# 🍽️ Restaurant Opportunity Score Analyzer

**CSE 6242 Team 022** - Predicting Restaurant Success by Location

A full-stack machine learning application that predicts 5-year restaurant survival probability using XGBoost, Yelp data, and U.S. Census demographics. Features an interactive web interface with choropleth maps for visualizing opportunity scores across 814 ZIP codes in 10 major U.S. cities.

![Project Status](https://img.shields.io/badge/status-complete-success)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![License](https://img.shields.io/badge/license-academic-lightgrey)

---

## 🎯 Project Overview

This application helps entrepreneurs and investors identify optimal locations for restaurant businesses by analyzing:
- **Economic Indicators**: Median income, employment rates, education levels
- **Market Saturation**: Existing restaurant density and competition  
- **Demographics**: Population density, age distribution, cultural diversity
- **Historical Patterns**: Restaurant survival data from Yelp (2018-2024)

**Output**: Opportunity scores (0-100%) representing the predicted probability that a restaurant will survive 5 years at a given location.

---

## ✨ Features

- 🗺️ **Interactive Choropleth Maps** - D3.js visualizations with color-coded ZIP codes
- 📊 **Real-time Predictions** - FastAPI backend with XGBoost ML model
- 🎨 **Modern UI** - Responsive web interface with gradient design
- 📋 **Dual Views** - Map view and sortable list view
- 🏙️ **10 Major Cities** - Philadelphia, Tampa, St. Louis, Indianapolis, Nashville, New Orleans, Tucson, St. Petersburg, Reno
- 🍕 **21 Restaurant Types** - All major cuisines and price ranges ($-$$$$)
- 📈 **Statistics Dashboard** - Key metrics and insights at a glance

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip package manager
- Modern web browser

### Installation

```bash
# Clone repository
git clone <repository-url>
cd cse-6242-restaurant-selection

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Verify setup
python verify_setup.py
```

### Running the Application

**Terminal 1 - Start Backend:**
```bash
source venv/bin/activate
python api.py
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
python -m http.server 8080
```

**Open Browser:**  
http://localhost:8080

---

## 📖 Usage

1. **Select a City** (e.g., Philadelphia, PA)
2. **Choose Restaurant Type** (e.g., Italian, Mexican, Chinese)
3. **Pick Price Range** ($ to $$$$)
4. **Click "Analyze Opportunity"**
5. **View Results** on interactive map or list

### Example

- **City**: Philadelphia, PA
- **Type**: Italian  
- **Price**: $$ (Moderate)
- **Result**: 71 ZIP codes analyzed, scores range 20-93%

---

## 🎨 Screenshots

*The application features:*
- Purple gradient modern interface
- Interactive maps with zoom/pan controls
- Hover tooltips showing detailed scores
- Statistics cards with key metrics
- Color-coded opportunity zones (red = low, green = high)

---

## 🔧 Technology Stack

### Frontend
- HTML5, CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- D3.js v5 (Data Visualization)
- TopoJSON v2 (Geographic Data)

### Backend
- FastAPI (REST API)
- XGBoost (ML Model)
- Pandas & NumPy (Data Processing)
- Uvicorn (ASGI Server)

### Data
- Yelp Open Dataset (65,168 restaurant records)
- U.S. Census Bureau (Demographic data)
- 814 ZIP codes across 10 cities
- 127 features per prediction

---

## 📊 Model Performance

- **Algorithm**: XGBoost Gradient Boosting Classifier
- **Accuracy**: ~82%
- **Precision**: ~79%
- **Recall**: ~85%
- **F1 Score**: ~82%

---

## 📁 Project Structure

```
cse-6242-restaurant-selection/
├── api.py                          # FastAPI backend server
├── constants.py                    # City/ZIP code mappings
├── test_api.py                     # Integration tests
├── verify_setup.py                 # Setup verification
├── requirements.txt                # Python dependencies
│
├── model/
│   ├── data_preprocessing_and_model.ipynb
│   └── xgboost_untuned_model.pkl   # Trained model
│
├── frontend/
│   ├── index.html                  # Web interface
│   ├── app.js                      # Frontend logic
│   └── README.md                   # Frontend docs
│
├── restaurant_row_data.csv         # Dataset (65k rows)
├── yelp_dataset/                   # Raw Yelp data
└── census_dataset/                 # Census data
```

---

## 🧪 Testing

```bash
# Activate virtual environment
source venv/bin/activate

# Run comprehensive tests
python test_api.py

# Expected output: ✅ Integration tests complete!
```

---

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[STATUS_UPDATE.md](STATUS_UPDATE.md)** - Project status and accomplishments
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command cheat sheet
- **[frontend/README.md](frontend/README.md)** - Frontend documentation
- **[API_SUMMARY.md](API_SUMMARY.md)** - API documentation

---

## 🌐 API Endpoints

### Health Check
```http
GET http://localhost:8000/
```

### Predict Opportunity Scores
```http
POST http://localhost:8000/predict
Content-Type: application/json

{
  "city": "Philadelphia",
  "state": "PA",
  "subtype": "Italian",
  "price_range": 2.0
}
```

**Interactive API Docs**: http://localhost:8000/docs

---

## 🎓 Academic Context

**Course**: CSE 6242 - Data and Visual Analytics  
**Institution**: Georgia Institute of Technology  
**Team**: Team 022  
**Project**: Restaurant Location Selection Analysis

---

## 🤝 Contributing

This is an academic project for CSE 6242. For questions or suggestions:

1. Review documentation files
2. Check troubleshooting section in SETUP.md
3. Test with `python test_api.py`
4. Open an issue with details

---

## ⚠️ Known Limitations

- Limited to 10 cities (814 ZIP codes)
- Fixed restaurant categories (21 types)
- Requires internet for map GeoJSON data
- Static model (no real-time updates)

---

## 🚀 Future Enhancements

- [ ] Add more cities and expand dataset
- [ ] Export results to CSV/PDF
- [ ] Comparison mode (compare multiple cities)
- [ ] Time-series predictions
- [ ] Mobile application
- [ ] User authentication

---

## 📄 License

This project is submitted as part of CSE 6242 coursework at Georgia Tech.

---

## 🙏 Acknowledgments

- **Yelp** - Open Dataset
- **U.S. Census Bureau** - Demographic data
- **OpenDataDE** - ZIP code GeoJSON data
- **D3.js** - Visualization library

---

## 📞 Support

For setup issues:
1. Run `python verify_setup.py`
2. Check [SETUP.md](SETUP.md) troubleshooting section
3. Review browser console (F12) for errors
4. Ensure both backend and frontend are running

---

**Built with ❤️ by CSE 6242 Team 022**

*Predicting restaurant success, one ZIP code at a time.*
