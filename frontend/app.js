//frontend app for restaurant - vanilla javascript

//use to test api in local host
const API_BASE_URL = 'http://localhost:8000';

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

let currentResults = null;
let currentView = 'map';

const colorScale = d3.scaleThreshold()
    .domain([30, 40, 50, 60, 70, 80])
    .range([
        "#e74c3c",  // red
        "#e67e22",  // orange
        "#f39c12",  // yellow/orange
        "#f1c40f",  // yellow
        "#2ecc71",  // light green
        "#27ae60",  // green
        "#16a085"   // dark green
    ]);

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

document.addEventListener('DOMContentLoaded', function() {
    initializeDropdowns();
    setupEventListeners();
});

function initializeDropdowns() {
    const citySelect = document.getElementById('city-select');
    const subtypeSelect = document.getElementById('subtype-select');
    
    CITIES.forEach(city => {
        const option = document.createElement('option');
        option.value = JSON.stringify({ city: city.city, state: city.state });
        option.textContent = `${city.city}, ${city.state} (${city.zip_count} zip codes)`;
        citySelect.appendChild(option);
    });
    
    RESTAURANT_TYPES.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        subtypeSelect.appendChild(option);
    });
}

function setupEventListeners() {
    const citySelect = document.getElementById('city-select');
    const subtypeSelect = document.getElementById('subtype-select');
    const priceRange = document.getElementById('price-range');
    const analyzeBtn = document.getElementById('analyze-btn');
    

    function checkFormValidity() {
        const isValid = citySelect.value && subtypeSelect.value && priceRange.value;
        analyzeBtn.disabled = !isValid;
    }
    
    citySelect.addEventListener('change', checkFormValidity);
    subtypeSelect.addEventListener('change', checkFormValidity);
    priceRange.addEventListener('change', checkFormValidity);

    analyzeBtn.addEventListener('click', handleAnalyze);
}

// when button is clicked, call API for scores, display
async function handleAnalyze() {
    const citySelect = document.getElementById('city-select');
    const subtypeSelect = document.getElementById('subtype-select');
    const priceRange = document.getElementById('price-range');
    
    const cityData = JSON.parse(citySelect.value);
    const subtype = subtypeSelect.value;
    const price = parseFloat(priceRange.value);
    
    showLoading();
    
    try {
        const results = await fetchOpportunityScores(cityData.city, cityData.state, subtype, price);
        currentResults = results;
        
        await displayResults(results, cityData);
    } catch (error) {
        showError(error.message);
    }
}

//post request - gets actual scores from API
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
        throw new Error(error.detail);
    }
    
    return await response.json();
}

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

function showError(message) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = `
        <div class="error-message">
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}

//function + html for results UI
async function displayResults(results, cityData) {
    const resultsSection = document.getElementById('results-section');
    
    const scores = results.zip_scores.map(z => z.score_percent);
    const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    const maxScore = Math.max(...scores).toFixed(1);
    const highOpportunity = results.zip_scores.filter(z => z.score_percent >= 70).length;
    
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
            <button class="view-btn active" data-view="map">Map View</button>
            <button class="view-btn" data-view="list">List View</button>
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
    
    createLegend();
    
    try {
        await renderChoroplethMap(results, cityData);
    } catch (error) {
        console.error('Map rendering failed:', error);
        showMapError();
        document.querySelector('[data-view="list"]').click();
    }
}

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

//uses d3.js for choropleth map
async function renderChoroplethMap(results, cityData) {
    const stateCode = cityData.state;
    const geoJsonUrl = STATE_GEOJSON_URLS[stateCode];
    
    if (!geoJsonUrl) {
        throw new Error(`no geojson data available for state: ${stateCode}`);
    }
    
    const geoData = await d3.json(geoJsonUrl);
    
    const scoresByZip = {};
    results.zip_scores.forEach(z => {
        scoresByZip[z.zip_code] = z;
    });
    
    const targetZips = new Set(results.zip_scores.map(z => z.zip_code));
    
    const targetFeatures = geoData.features.filter(f => {
        const zipCode = f.properties.ZCTA5CE10 || f.properties.ZIP || f.properties.GEOID10;
        return targetZips.has(String(zipCode));
    });
    
    if (targetFeatures.length === 0) {
        throw new Error('No matching ZIP codes found in GeoJSON data');
    }
    
    const container = document.getElementById('map-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const svg = d3.select("#choropleth")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");
    
    svg.selectAll("*").remove();
    
    const g = svg.append("g");
    const zipCodesGroup = g.append("g");
    
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("display", "none");
    
    const projection = d3.geoMercator()
        .fitSize([width, height], { type: "FeatureCollection", features: targetFeatures });
    
    const path = d3.geoPath().projection(projection);
    
    const zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", function() {
            g.attr("transform", d3.event.transform);
        });
    
    svg.call(zoom);
    
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

function showMapError() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6c757d; text-align: center; padding: 40px;">
            <div>
                <h3>Map View Unavailable</h3>
                <p>Unable to load map visualization. Please use the List View instead.</p>
            </div>
        </div>
    `;
}

function renderListView(results) {
    const listContainer = document.getElementById('zip-list');
    listContainer.innerHTML = '';
    
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
        `;
        
        listContainer.appendChild(card);
    });
}

