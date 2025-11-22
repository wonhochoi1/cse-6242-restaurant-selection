// Restaurant Opportunity Score Analyzer - Frontend Application
// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// Constants
const CITIES = [
    { city: "Philadelphia", state: "PA", zip_count: 71 },
    { city: "Tampa Bay", state: "FL", zip_count: 59 },
    { city: "Tampa", state: "FL", zip_count: 46 },
    { city: "St. Louis", state: "MO", zip_count: 58 },
    { city: "Indianapolis", state: "IN", zip_count: 52 },
    { city: "Nashville", state: "TN", zip_count: 36 },
    { city: "New Orleans", state: "LA", zip_count: 30 },
    { city: "Tucson", state: "AZ", zip_count: 35 },
    { city: "St. Petersburg", state: "FL", zip_count: 22 },
    { city: "Reno", state: "NV", zip_count: 19 }
];

const RESTAURANT_TYPES = [
    "American", "Breakfast", "Cafe", "Chinese", "Dessert", "Diner",
    "Fast Food", "French", "General", "Greek", "Indian", "Italian",
    "Japanese", "Korean", "Mediterranean", "Mexican", "Pizza",
    "Seafood", "Steakhouse", "Thai", "Vietnamese"
];

// State management
let currentResults = null;
let currentView = 'map';

// Color scale for opportunity scores (0-100%)
const colorScale = d3.scaleThreshold()
    .domain([30, 40, 50, 60, 70, 80])
    .range([
        "#e74c3c",  // Red (< 30%: Very Low)
        "#e67e22",  // Orange (30-40%: Low)
        "#f39c12",  // Yellow-orange (40-50%: Below Average)
        "#f1c40f",  // Yellow (50-60%: Average)
        "#2ecc71",  // Light green (60-70%: Above Average)
        "#27ae60",  // Green (70-80%: High)
        "#16a085"   // Dark green (> 80%: Very High)
    ]);

// State-specific GeoJSON URLs
const STATE_GEOJSON_URLS = {
    'PA': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/pa_pennsylvania_zip_codes_geo.min.json',
    'FL': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/fl_florida_zip_codes_geo.min.json',
    'MO': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/mo_missouri_zip_codes_geo.min.json',
    'IN': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/in_indiana_zip_codes_geo.min.json',
    'TN': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/tn_tennessee_zip_codes_geo.min.json',
    'LA': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/la_louisiana_zip_codes_geo.min.json',
    'AZ': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/az_arizona_zip_codes_geo.min.json',
    'NV': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/nv_nevada_zip_codes_geo.min.json'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDropdowns();
    setupEventListeners();
});

// Initialize dropdowns with data
function initializeDropdowns() {
    const citySelect = document.getElementById('city-select');
    const subtypeSelect = document.getElementById('subtype-select');
    
    // Populate cities
    CITIES.forEach(city => {
        const option = document.createElement('option');
        option.value = JSON.stringify({ city: city.city, state: city.state });
        option.textContent = `${city.city}, ${city.state} (${city.zip_count} zip codes)`;
        citySelect.appendChild(option);
    });
    
    // Populate restaurant types
    RESTAURANT_TYPES.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        subtypeSelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    const citySelect = document.getElementById('city-select');
    const subtypeSelect = document.getElementById('subtype-select');
    const priceRange = document.getElementById('price-range');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    // Enable analyze button when all fields are selected
    function checkFormValidity() {
        const isValid = citySelect.value && subtypeSelect.value && priceRange.value;
        analyzeBtn.disabled = !isValid;
    }
    
    citySelect.addEventListener('change', checkFormValidity);
    subtypeSelect.addEventListener('change', checkFormValidity);
    priceRange.addEventListener('change', checkFormValidity);
    
    // Analyze button click
    analyzeBtn.addEventListener('click', handleAnalyze);
}

// Handle analyze button click
async function handleAnalyze() {
    const citySelect = document.getElementById('city-select');
    const subtypeSelect = document.getElementById('subtype-select');
    const priceRange = document.getElementById('price-range');
    
    const cityData = JSON.parse(citySelect.value);
    const subtype = subtypeSelect.value;
    const price = parseFloat(priceRange.value);
    
    // Show loading state
    showLoading();
    
    try {
        // Call API
        const results = await fetchOpportunityScores(cityData.city, cityData.state, subtype, price);
        currentResults = results;
        
        // Display results
        await displayResults(results, cityData);
    } catch (error) {
        showError(error.message);
    }
}

// Fetch opportunity scores from API
async function fetchOpportunityScores(city, state, subtype, priceRange) {
    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            city: city,
            state: state,
            subtype: subtype,
            price_range: priceRange
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch opportunity scores');
    }
    
    return await response.json();
}

// Show loading state
function showLoading() {
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <h3>Analyzing opportunity scores...</h3>
            <p>This may take a moment</p>
        </div>
    `;
}

// Show error message
function showError(message) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = `
        <div class="error-message">
            <h3>❌ Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Display results
async function displayResults(results, cityData) {
    const resultsSection = document.getElementById('results-section');
    
    // Calculate statistics
    const scores = results.zip_scores.map(z => z.score_percent);
    const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    const maxScore = Math.max(...scores).toFixed(1);
    const highOpportunity = results.zip_scores.filter(z => z.score_percent >= 70).length;
    
    // Create results HTML
    resultsSection.innerHTML = `
        <div class="info-message">
            <strong>Results for ${results.city}, ${results.state}</strong><br>
            ${results.subtype} restaurant • Price: ${'$'.repeat(Math.floor(results.price_range))}
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${results.total_zip_codes}</div>
                <div class="stat-label">ZIP Codes Analyzed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${avgScore}%</div>
                <div class="stat-label">Average Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${maxScore}%</div>
                <div class="stat-label">Highest Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${highOpportunity}</div>
                <div class="stat-label">High Opportunity Zones</div>
            </div>
        </div>
        
        <div class="view-toggle">
            <button class="view-btn active" data-view="map">🗺️ Map View</button>
            <button class="view-btn" data-view="list">📋 List View</button>
        </div>
        
        <div id="visualization-container">
            <div id="map-view" class="map-view active">
                <div id="map-container">
                    <svg id="choropleth"></svg>
                    <div class="legend" id="legend"></div>
                </div>
            </div>
            
            <div id="list-view" class="list-view">
                <div class="zip-list" id="zip-list"></div>
            </div>
        </div>
    `;
    
    // Setup view toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            currentView = view;
            
            if (view === 'map') {
                document.getElementById('map-view').style.display = 'block';
                document.getElementById('list-view').style.display = 'none';
            } else {
                document.getElementById('map-view').style.display = 'none';
                document.getElementById('list-view').style.display = 'block';
                renderListView(results);
            }
        });
    });
    
    // Create legend
    createLegend();
    
    // Try to render map, fallback to list if it fails
    try {
        await renderChoroplethMap(results, cityData);
    } catch (error) {
        console.error('Map rendering failed:', error);
        showMapError();
        // Auto-switch to list view
        document.querySelector('[data-view="list"]').click();
    }
}

// Create legend
function createLegend() {
    const legendContainer = d3.select("#legend");
    legendContainer.selectAll("*").remove();
    
    legendContainer.append("div")
        .attr("class", "legend-title")
        .text("Opportunity Score");
    
    const legendData = [
        { color: "#16a085", label: "80-100% (Very High)" },
        { color: "#27ae60", label: "70-80% (High)" },
        { color: "#2ecc71", label: "60-70% (Above Avg)" },
        { color: "#f1c40f", label: "50-60% (Average)" },
        { color: "#f39c12", label: "40-50% (Below Avg)" },
        { color: "#e67e22", label: "30-40% (Low)" },
        { color: "#e74c3c", label: "<30% (Very Low)" }
    ];
    
    legendData.forEach(item => {
        const legendItem = legendContainer.append("div")
            .attr("class", "legend-item");
        
        legendItem.append("div")
            .attr("class", "legend-color")
            .style("background-color", item.color);
        
        legendItem.append("span")
            .text(item.label);
    });
}

// Render choropleth map
async function renderChoroplethMap(results, cityData) {
    const stateCode = cityData.state;
    const geoJsonUrl = STATE_GEOJSON_URLS[stateCode];
    
    if (!geoJsonUrl) {
        throw new Error(`No GeoJSON data available for state: ${stateCode}`);
    }
    
    // Fetch GeoJSON data
    const geoData = await d3.json(geoJsonUrl);
    
    // Create lookup map
    const scoresByZip = {};
    results.zip_scores.forEach(z => {
        scoresByZip[z.zip_code] = z;
    });
    
    // Get ZIP codes from results
    const targetZips = new Set(results.zip_scores.map(z => z.zip_code));
    
    // Filter features to only target ZIP codes
    const targetFeatures = geoData.features.filter(f => {
        const zipCode = f.properties.ZCTA5CE10 || f.properties.ZIP || f.properties.GEOID10;
        return targetZips.has(String(zipCode));
    });
    
    if (targetFeatures.length === 0) {
        throw new Error('No matching ZIP codes found in GeoJSON data');
    }
    
    // Setup SVG
    const container = document.getElementById('map-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const svg = d3.select("#choropleth")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");
    
    svg.selectAll("*").remove();
    
    // Create group for zooming
    const g = svg.append("g");
    const zipCodesGroup = g.append("g");
    
    // Create tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("display", "none");
    
    // Setup projection
    const projection = d3.geoMercator()
        .fitSize([width, height], { type: "FeatureCollection", features: targetFeatures });
    
    const path = d3.geoPath().projection(projection);
    
    // Setup zoom
    const zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", function() {
            g.attr("transform", d3.event.transform);
        });
    
    svg.call(zoom);
    
    // Draw ZIP codes
    zipCodesGroup.selectAll("path")
        .data(targetFeatures)
        .enter()
        .append("path")
        .attr("class", "zipcode")
        .attr("d", path)
        .style("fill", function(d) {
            const zipCode = String(d.properties.ZCTA5CE10 || d.properties.ZIP || d.properties.GEOID10);
            const data = scoresByZip[zipCode];
            
            if (data) {
                return colorScale(data.score_percent);
            }
            return "#bdc3c7";
        })
        .on("mouseover", function(d) {
            const zipCode = String(d.properties.ZCTA5CE10 || d.properties.ZIP || d.properties.GEOID10);
            const data = scoresByZip[zipCode];
            
            let tooltipHtml = `<strong>ZIP: ${zipCode}</strong><br/>`;
            
            if (data) {
                tooltipHtml += `
                    Opportunity Score: <strong>${data.score_percent}%</strong><br/>
                    Rating: <strong>${data.rating}</strong><br/>
                    Type: ${data.restaurant_type}
                `;
                
                // Add top 2 SHAP features if available (with plain language)
                if (data.top_features && data.top_features.length > 0) {
                    tooltipHtml += `<br/><div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">`;
                    tooltipHtml += `<strong style="font-size: 11px; color: #3498db;">Why ${data.score_percent}%:</strong><br/>`;
                    tooltipHtml += `<div style="font-size: 9px; color: rgba(255,255,255,0.7); margin-bottom: 4px;">✓ increases • ✗ decreases opportunity</div>`;
                    
                    data.top_features.slice(0, 2).forEach(feat => {
                        const isPositive = feat.value > 0;
                        const icon = isPositive ? '✓' : '✗';
                        const color = isPositive ? '#2ecc71' : '#e74c3c';
                        const description = getFeatureDescription(feat.name, feat.value);
                        tooltipHtml += `<div style="font-size: 10px; margin: 3px 0; line-height: 1.3;"><span style="color: ${color}; font-weight: bold;">${icon}</span> <span style="color: rgba(255,255,255,0.9);">${description}</span></div>`;
                    });
                    tooltipHtml += `</div>`;
                }
            } else {
                tooltipHtml += `No data available`;
            }
            
            tooltip.style("display", "block")
                .html(tooltipHtml);
        })
        .on("mousemove", function() {
            tooltip.style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });
    
    // Auto-fit to bounds
    const bounds = path.bounds({ type: "FeatureCollection", features: targetFeatures });
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
    const translate = [width / 2 - scale * x, height / 2 - scale * y];
    
    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
}

// Show map error
function showMapError() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6c757d; text-align: center; padding: 40px;">
            <div>
                <h3>⚠️ Map View Unavailable</h3>
                <p>Unable to load map visualization. Please use the List View instead.</p>
            </div>
        </div>
    `;
}

// Convert feature name to plain language description
function getFeatureDescription(featureName, value) {
    const isPositive = value > 0;
    const absValue = Math.abs(value);
    const strength = absValue > 0.5 ? 'strongly' : absValue > 0.2 ? 'moderately' : 'slightly';
    
    // Restaurant type features
    if (featureName.startsWith('Restaurant Type: ')) {
        const cuisine = featureName.replace('Restaurant Type: ', '');
        return isPositive 
            ? `${cuisine} restaurants perform well in this area`
            : `${cuisine} restaurants may struggle in this area`;
    }
    
    // Age of restaurants
    if (featureName.includes('Age of ') && featureName.includes(' Restaurants')) {
        const cuisine = featureName.match(/Age of (.+?) Restaurants/)?.[1] || '';
        return isPositive
            ? `Existing ${cuisine} restaurants are well-established here`
            : `Existing ${cuisine} restaurants are relatively new here`;
    }
    
    // Price level
    if (featureName === 'Price Level') {
        return isPositive
            ? `Your selected price level matches this area well`
            : `Your selected price level may be too high or low for this area`;
    }
    
    // Average price of restaurants
    if (featureName.includes('Average Price of ')) {
        const cuisine = featureName.replace('Average Price of ', '').replace(' Restaurants', '');
        return isPositive
            ? `Average prices for ${cuisine} restaurants align well here`
            : `Average prices for ${cuisine} restaurants differ from your selection`;
    }
    
    // Average rating
    if (featureName.includes('Average Rating')) {
        return isPositive
            ? `Restaurants in this area have good ratings`
            : `Restaurant ratings in this area are lower`;
    }
    
    // Competition density
    if (featureName === 'Competition Density') {
        return isPositive
            ? `Healthy competition level (not oversaturated)`
            : `High competition may make it harder to succeed`;
    }
    
    // Population features
    if (featureName.includes('Population')) {
        return isPositive
            ? `Good population density supports restaurant demand`
            : `Lower population may limit customer base`;
    }
    
    // Number of restaurants
    if (featureName.includes('Number of ') || featureName.includes('Total Restaurants')) {
        return isPositive
            ? `Healthy restaurant ecosystem in this area`
            : `Fewer restaurants in area (may indicate lower demand)`;
    }
    
    // Default fallback
    return isPositive
        ? `${featureName} ${strength} increases opportunity`
        : `${featureName} ${strength} decreases opportunity`;
}

// Display SHAP feature importance with plain language
function displaySHAP(zipData) {
    if (!zipData.top_features || zipData.top_features.length === 0) return '';
    
    let html = '<div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee;">';
    html += `<div style="font-size: 11px; font-weight: 600; margin-bottom: 4px; color: #495057;">Why this location scored ${zipData.score_percent}%:</div>`;
    html += '<div style="font-size: 9px; color: #6c757d; margin-bottom: 8px; font-style: italic;">These factors explain the opportunity score</div>';
    
    zipData.top_features.forEach(f => {
        const isPositive = f.value > 0;
        const color = isPositive ? '#27ae60' : '#e74c3c';
        const icon = isPositive ? '✓' : '✗';
        const barWidth = Math.min(Math.abs(f.value) * 100, 100);
        const description = getFeatureDescription(f.name, f.value);
        
        html += `
            <div style="margin: 6px 0; font-size: 10px;">
                <div style="display: flex; align-items: flex-start; margin-bottom: 2px;">
                    <span style="color: ${color}; margin-right: 6px; width: 12px; font-weight: bold;">${icon}</span>
                    <span style="flex: 1; color: #333; line-height: 1.4;">${description}</span>
                </div>
                <div style="display: flex; align-items: center; margin-left: 18px;">
                    <div style="width: 50px; height: 4px; background: #eee; margin-right: 6px; border-radius: 2px; overflow: hidden;">
                        <div style="width: ${barWidth}%; height: 100%; background: ${color};"></div>
                    </div>
                    <span style="color: ${color}; font-weight: 600; font-size: 9px;">${f.value > 0 ? '+' : ''}${f.value.toFixed(3)}</span>
                </div>
            </div>
        `;
    });
    
    html += '<div style="font-size: 8px; color: #999; margin-top: 6px; padding-top: 6px; border-top: 1px solid #f0f0f0;">✓ = increases opportunity • ✗ = decreases opportunity</div>';
    
    return html + '</div>';
}

// Render list view
function renderListView(results) {
    const listContainer = document.getElementById('zip-list');
    listContainer.innerHTML = '';
    
    // Sort by score (highest first)
    const sortedScores = [...results.zip_scores].sort((a, b) => b.score_percent - a.score_percent);
    
    sortedScores.forEach(zipData => {
        const card = document.createElement('div');
        card.className = 'zip-card';
        
        const ratingClass = zipData.score_percent >= 70 ? 'high' : 
                           zipData.score_percent >= 50 ? 'moderate' : 'low';
        
        const scoreColor = colorScale(zipData.score_percent);
        
        card.innerHTML = `
            <div class="zip-code">ZIP ${zipData.zip_code}</div>
            <div class="score" style="color: ${scoreColor}">${zipData.score_percent}%</div>
            <div style="font-size: 12px; color: #6c757d; margin-bottom: 8px;">
                ${zipData.restaurant_type}
            </div>
            <div class="rating ${ratingClass}">
                ${zipData.rating}
            </div>
            ${displaySHAP(zipData)}
        `;
        
        listContainer.appendChild(card);
    });
}

