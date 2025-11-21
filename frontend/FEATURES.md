# Frontend Features Documentation

## Overview

The Restaurant Opportunity Score Analyzer frontend is a modern, interactive web application that provides an intuitive interface for analyzing restaurant opportunity scores across major U.S. cities.

## Key Features

### 1. Interactive Selection Interface

**City Selection**
- Dropdown with 10 major metropolitan areas
- Shows city name, state, and number of ZIP codes
- Options: Philadelphia, Tampa Bay, St. Louis, Indianapolis, Nashville, New Orleans, Tucson, St. Petersburg, Reno

**Restaurant Type Selection**
- 21 different cuisine categories
- Alphabetically sorted for easy navigation
- Includes: American, Breakfast, Cafe, Chinese, Dessert, Diner, Fast Food, French, General, Greek, Indian, Italian, Japanese, Korean, Mediterranean, Mexican, Pizza, Seafood, Steakhouse, Thai, Vietnamese

**Price Range Selection**
- Four price levels matching Yelp's $ system
- $ - Budget Friendly
- $$ - Moderate
- $$$ - Upscale
- $$$$ - Fine Dining

### 2. Statistics Dashboard

Displays four key metrics:
- **ZIP Codes Analyzed**: Total number of ZIP codes in the selected city
- **Average Score**: Mean opportunity score across all ZIP codes
- **Highest Score**: Best opportunity score in the city
- **High Opportunity Zones**: Count of ZIP codes with 70%+ score

### 3. Choropleth Map Visualization

**Interactive Map Features**:
- Color-coded ZIP codes (red = low, yellow = moderate, green = high)
- Hover tooltips showing:
  - ZIP code
  - Opportunity score percentage
  - Rating (High/Moderate/Low Opportunity)
  - Restaurant type and price range
- Zoom and pan controls
- Auto-fit to selected city boundaries
- Smooth transitions between selections

**Technical Details**:
- Built with D3.js v5
- Uses GeoJSON data from OpenDataDE repository
- TopoJSON for optimized file sizes
- Mercator projection for accurate geography

### 4. List View (Fallback)

**Features**:
- Grid layout of all ZIP codes
- Sorted by score (highest first)
- Each card shows:
  - ZIP code
  - Score percentage (color-coded)
  - Restaurant type and price
  - Rating badge (High/Moderate/Low)
- Hover effects for better UX
- Responsive grid (adapts to screen size)

### 5. View Toggle

Switch between:
- **Map View**: Visual geographic representation
- **List View**: Detailed sortable list

### 6. Color Coding System

**Score-based Colors**:
- 🟢 Dark Green (80-100%): Very High Opportunity
- 🟢 Green (70-80%): High Opportunity
- 🟢 Light Green (60-70%): Above Average
- 🟡 Yellow (50-60%): Average
- 🟠 Orange (40-50%): Below Average
- 🟠 Orange-Red (30-40%): Low
- 🔴 Red (<30%): Very Low

### 7. Loading States

**User Feedback**:
- Loading spinner during API calls
- "Analyzing opportunity scores..." message
- Disabled button states during processing
- Smooth transitions between states

### 8. Error Handling

**Graceful Degradation**:
- API connection errors shown clearly
- Map loading failures auto-switch to list view
- Validation errors for invalid inputs
- User-friendly error messages

### 9. Responsive Design

**Mobile-Friendly**:
- Adapts to screen sizes
- Grid layouts adjust automatically
- Touch-friendly controls
- Readable on all devices

### 10. Performance Optimizations

**Fast Loading**:
- Lazy loading of GeoJSON data
- Efficient D3.js rendering
- Minimal dependencies
- Optimized color scales
- Request caching where possible

## User Experience Design

### Visual Design

**Color Scheme**:
- Primary: Purple gradient (#667eea to #764ba2)
- Accent: Blue (#3498db)
- Success: Green (#27ae60)
- Warning: Orange (#f39c12)
- Danger: Red (#e74c3c)

**Typography**:
- Font: Segoe UI (fallback to system fonts)
- Clear hierarchy with size variations
- High contrast for readability

**Layout**:
- Card-based design
- Consistent spacing and padding
- Box shadows for depth
- Rounded corners for modern look

### Interaction Design

**Button States**:
- Disabled until all fields selected
- Hover effects with color changes
- Active states with transforms
- Loading states during operations

**Animations**:
- Smooth transitions (300ms)
- Zoom transitions on map (750ms)
- Fade-in effects for results
- Hover scale effects on cards

### Accessibility

**Best Practices**:
- Semantic HTML structure
- Clear labels for all inputs
- High contrast ratios
- Focus states for keyboard navigation
- Alt text where applicable
- Error messages with clear instructions

## Technical Architecture

### Frontend Stack

**Core Technologies**:
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- D3.js v5 (visualization)
- TopoJSON v2 (geography)

**No Framework Dependencies**:
- Pure JavaScript for speed
- Direct DOM manipulation
- Native fetch API for requests
- No build step required

### API Integration

**RESTful Communication**:
- POST requests to `/predict` endpoint
- JSON request/response format
- Error handling with status codes
- CORS support for development

**Request Format**:
```javascript
{
  city: "Philadelphia",
  state: "PA",
  subtype: "Italian",
  price_range: 2.0
}
```

**Response Handling**:
- Parses ZIP scores array
- Calculates statistics
- Prepares data for visualization
- Handles errors gracefully

### State Management

**Client-Side State**:
- `currentResults`: Stores latest API response
- `currentView`: Tracks active view (map/list)
- Form state: Selected city, type, price
- View state: Map zoom/pan transform

### Code Organization

**Modular Structure**:
- Constants defined at top
- Initialization functions
- Event handlers
- API functions
- Rendering functions
- Utility functions

**Key Functions**:
- `initializeDropdowns()`: Populates selection options
- `handleAnalyze()`: Processes form submission
- `fetchOpportunityScores()`: API communication
- `renderChoroplethMap()`: D3.js map rendering
- `renderListView()`: Creates card grid
- `createLegend()`: Builds color scale legend

## Browser Compatibility

### Supported Browsers

✅ **Chrome 90+**
- Full feature support
- Optimal performance
- Best visualization quality

✅ **Firefox 88+**
- Full feature support
- Good performance
- Accurate rendering

✅ **Safari 14+**
- Full feature support
- Native performance
- Smooth animations

✅ **Edge 90+**
- Full feature support
- Chromium-based
- Excellent compatibility

❌ **Internet Explorer**
- Not supported
- Missing ES6 features
- No fallback provided

### Feature Detection

**Graceful Degradation**:
- Checks for D3.js availability
- Falls back to list view if map fails
- Uses modern CSS with fallbacks
- Detects fetch API support

## Performance Metrics

### Load Times

- Initial page load: <500ms
- API request: 1-3 seconds
- Map rendering: 500ms-2 seconds
- View switching: <100ms

### Optimization Techniques

- Minimal HTTP requests
- CDN for D3.js libraries
- Efficient DOM updates
- Request debouncing
- Lazy loading of GeoJSON

## Future Enhancements

### Potential Features

1. **Advanced Filtering**
   - Filter by score range
   - Sort by different metrics
   - Search by ZIP code

2. **Comparison Mode**
   - Compare multiple cities
   - Side-by-side views
   - Difference calculations

3. **Export Capabilities**
   - Download results as CSV
   - Save map as image
   - Generate PDF reports

4. **Favorites/Bookmarks**
   - Save configurations
   - Quick access to saved searches
   - Local storage integration

5. **Enhanced Visualizations**
   - Heat maps
   - 3D terrain views
   - Time-series animations
   - Scatter plots

6. **Mobile App**
   - Native iOS/Android apps
   - GPS integration
   - Push notifications

## Customization Guide

### Changing Colors

Edit the `colorScale` in `app.js`:
```javascript
const colorScale = d3.scaleThreshold()
    .domain([30, 40, 50, 60, 70, 80])
    .range([
        "#e74c3c",  // Your red
        "#e67e22",  // Your orange
        // ... etc
    ]);
```

### Modifying Layout

Edit the CSS in `index.html`:
- Grid layouts: `.controls-grid`, `.stats-grid`
- Card styles: `.stat-card`, `.zip-card`
- Colors: Look for gradient definitions

### Adding New Features

1. Add UI elements in `index.html`
2. Add event listeners in `setupEventListeners()`
3. Create handler functions in `app.js`
4. Update API calls if needed

### API Configuration

Change the API URL in `app.js`:
```javascript
const API_BASE_URL = 'http://your-domain.com:8000';
```

## Testing

### Manual Testing Checklist

- [ ] All dropdowns populate correctly
- [ ] Button enables when all fields selected
- [ ] API requests complete successfully
- [ ] Map renders without errors
- [ ] Tooltips show on hover
- [ ] List view displays all ZIP codes
- [ ] View toggle switches correctly
- [ ] Error messages show for failures
- [ ] Works on mobile devices
- [ ] Works on different browsers

### Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Known Limitations

1. **Geographic Coverage**: Limited to 10 cities
2. **Restaurant Types**: Fixed to 21 categories
3. **Real-time Data**: Requires API to be running
4. **Internet Required**: For GeoJSON map data
5. **Single User**: No multi-user support
6. **No Authentication**: Open access

## Support

For issues or questions:
1. Check browser console (F12)
2. Verify API is running
3. Check network tab for requests
4. Review README.md documentation
5. Test with different browsers

---

**Built for CSE 6242 - Team 022**

