# Restaurant Opportunity Score Analyzer - Frontend

A modern web application for analyzing restaurant opportunity scores across major U.S. cities. This frontend interfaces with the FastAPI backend to provide interactive visualizations of 5-year restaurant survival probabilities.

## Features

✨ **Interactive Choropleth Maps** - Visualize opportunity scores across ZIP codes with color-coded maps
📊 **Statistics Dashboard** - View key metrics including average scores and high-opportunity zones
📋 **List View** - Alternate view showing all ZIP codes with their scores in a sortable list
🎨 **Modern UI** - Clean, responsive design with gradient themes
🔄 **Real-time Analysis** - Instant predictions from the ML model via API

## Quick Start

### Prerequisites

1. **Backend API must be running**
   ```bash
   # From the project root directory
   python api.py
   ```
   The API should be accessible at `http://localhost:8000`

2. **Modern web browser** with JavaScript enabled

### Running the Frontend

#### Option 1: Simple Python Server (Recommended)

```bash
cd frontend
python -m http.server 8080
```

Then open your browser to: `http://localhost:8080`

#### Option 2: Any HTTP Server

You can use any local web server. For example:

**Using Node.js:**
```bash
cd frontend
npx http-server -p 8080
```

**Using PHP:**
```bash
cd frontend
php -S localhost:8080
```

#### Option 3: Direct File Access

You can also open `index.html` directly in your browser, but some features may not work due to CORS restrictions.

## Usage Guide

### Step 1: Select Parameters

1. **Choose a City** - Select from 10 major U.S. cities:
   - Philadelphia, PA (71 ZIP codes)
   - Tampa Bay, FL (59 ZIP codes)
   - St. Louis, MO (58 ZIP codes)
   - Indianapolis, IN (52 ZIP codes)
   - Tampa, FL (46 ZIP codes)
   - Nashville, TN (36 ZIP codes)
   - Tucson, AZ (35 ZIP codes)
   - New Orleans, LA (30 ZIP codes)
   - St. Petersburg, FL (22 ZIP codes)
   - Reno, NV (19 ZIP codes)

2. **Select Restaurant Type** - Choose from 21 restaurant categories:
   - American, Breakfast, Cafe, Chinese, Dessert, Diner, Fast Food
   - French, General, Greek, Indian, Italian, Japanese, Korean
   - Mediterranean, Mexican, Pizza, Seafood, Steakhouse, Thai, Vietnamese

3. **Pick Price Range**:
   - $ - Budget Friendly
   - $$ - Moderate
   - $$$ - Upscale
   - $$$$ - Fine Dining

### Step 2: Analyze

Click the **"Analyze Opportunity"** button to generate predictions for all ZIP codes in the selected city.

### Step 3: Review Results

The application displays:

**Statistics Cards:**
- Total ZIP codes analyzed
- Average opportunity score
- Highest opportunity score
- Number of high-opportunity zones (≥70%)

**Map View (Default):**
- Interactive choropleth map showing scores by ZIP code
- Color-coded from red (low opportunity) to green (high opportunity)
- Hover over ZIP codes to see detailed information
- Zoom and pan controls

**List View:**
- Sortable list of all ZIP codes
- Score percentage and rating for each zone
- Click "List View" button to switch views

## Understanding the Scores

### Opportunity Score Ranges

| Score | Color | Rating | Interpretation |
|-------|-------|--------|----------------|
| 80-100% | Dark Green | Very High | Excellent opportunity - Prime location |
| 70-80% | Green | High | Strong opportunity - Highly recommended |
| 60-70% | Light Green | Above Average | Good opportunity - Favorable conditions |
| 50-60% | Yellow | Average | Moderate opportunity - Careful planning needed |
| 40-50% | Orange | Below Average | Challenging opportunity - Higher risk |
| 30-40% | Orange-Red | Low | Limited opportunity - Significant challenges |
| <30% | Red | Very Low | Poor opportunity - Not recommended |

### What the Score Means

The **Opportunity Score** represents the predicted probability (0-100%) that a restaurant of the specified type and price range will survive for 5 years in that ZIP code, based on:

- Economic indicators (median income, population density)
- Market saturation (existing restaurant density)
- Historical restaurant survival data
- Demographic factors

**Example:** A score of 75% means the model predicts a 75% probability that the restaurant will still be operating 5 years after opening.

## Technical Details

### Architecture

- **Frontend:** Vanilla JavaScript with D3.js for visualizations
- **Backend:** FastAPI with XGBoost ML model
- **Data:** ZIP code-level features from Yelp and Census datasets

### API Integration

The frontend communicates with the backend via REST API:

**Endpoint:** `POST /predict`

**Request:**
```json
{
  "city": "Philadelphia",
  "state": "PA",
  "subtype": "Italian",
  "price_range": 2.0
}
```

**Response:**
```json
{
  "city": "Philadelphia",
  "state": "PA",
  "subtype": "Italian",
  "price_range": 2.0,
  "total_zip_codes": 71,
  "zip_scores": [
    {
      "zip_code": "19102",
      "opportunity_score": 0.8923,
      "score_percent": 89.2,
      "rating": "High Opportunity",
      "restaurant_type": "Italian (Price: $$)"
    },
    ...
  ]
}
```

### Map Data Sources

The application uses GeoJSON data from [OpenDataDE State ZIP Code GeoJSON repository](https://github.com/OpenDataDE/State-zip-code-GeoJSON) for accurate ZIP code boundary visualization.

## Troubleshooting

### Map Not Loading

If the choropleth map fails to load:
1. Check your internet connection (GeoJSON files are loaded from CDN)
2. Check browser console for errors
3. Switch to **List View** as a fallback

The application automatically falls back to list view if map rendering fails.

### API Connection Errors

If you see "Failed to fetch opportunity scores":
1. Ensure the backend API is running (`python api.py`)
2. Verify the API is accessible at `http://localhost:8000`
3. Check the browser console for CORS errors
4. Make sure the model file (`xgboost_untuned_model.pkl`) is present

### No Data for City

If you get "No zip codes found for city":
- The city may not be in the dataset
- Try selecting from the dropdown (only 10 cities are supported)

## Browser Compatibility

- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ⚠️ Internet Explorer not supported

## Performance

- Initial load: < 1 second
- API prediction: 1-3 seconds (depends on number of ZIP codes)
- Map rendering: 1-2 seconds
- Typical total time: 3-5 seconds

## Customization

### Changing API URL

Edit `app.js`:
```javascript
const API_BASE_URL = 'http://your-api-url:8000';
```

### Adjusting Color Scheme

Modify the `colorScale` in `app.js`:
```javascript
const colorScale = d3.scaleThreshold()
    .domain([30, 40, 50, 60, 70, 80])
    .range([/* your colors */]);
```

### Styling

All styles are in `index.html` within the `<style>` tag. Modify CSS to match your branding.

## Project Structure

```
frontend/
├── index.html          # Main HTML page
├── app.js             # JavaScript application logic
└── README.md          # This file
```

## Credits

- **D3.js** - Data visualization library
- **TopoJSON** - Geographic data format
- **OpenDataDE** - ZIP code GeoJSON data
- **FastAPI** - Backend framework
- **XGBoost** - Machine learning model

## License

This project is part of CSE 6242 at Georgia Tech.

## Support

For issues or questions:
1. Check the backend API is running
2. Review browser console for errors
3. Ensure all dependencies are loaded
4. Try the List View as an alternative to the map

---

**Built for CSE 6242 - Team 022**

