"""
Restaurant Opportunity Score API
FastAPI backend for predicting restaurant success by location
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import pandas as pd
import joblib
import numpy as np
from pathlib import Path
from constants import RESTAURANT_SUBTYPES, AVAILABLE_ZIP_CODES, get_cities, get_zip_codes_for_city

# FastAPI app
app = FastAPI(
    title="Restaurant Opportunity Score API",
    description="Predict restaurant 5-year survival probability by location",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
zip_context_df = None
df_final = None

# request response models
class CityOpportunityRequest(BaseModel):
    city: str = Field(..., example="Philadelphia")
    state: Optional[str] = Field(None, example="PA", description="Optional state code for disambiguation")
    subtype: str = Field(..., example="Italian")
    price_range: float = Field(..., ge=1.0, le=4.0, example=2.0)

class ZipCodeScore(BaseModel):
    zip_code: str
    opportunity_score: float
    score_percent: float
    rating: str
    restaurant_type: str

class OpportunityResponse(BaseModel):
    city: str
    state: Optional[str]
    subtype: str
    price_range: float
    total_zip_codes: int
    zip_scores: List[ZipCodeScore]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    data_loaded: bool
    total_zip_codes: int
    available_subtypes: List[str]

#starting event
@app.on_event("startup")
async def load_model_and_data():
    """Load the trained model and preprocessed data on startup"""
    global model, zip_context_df, df_final
    
    try:
        print("Loading model and data...")
        
        #load model
        model_path = Path("model/xgboost_untuned_model.pkl")
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found: {model_path}")
        model = joblib.load(model_path)
        print(f"✓ Model loaded from {model_path}")
        
        #load preprocessed data
        data_path = Path("restaurant_row_data.csv")
        if not data_path.exists():
            raise FileNotFoundError(f"Data file not found: {data_path}")
        df_final = pd.read_csv(data_path, dtype={'zip_code': str})
        print(f"Data loaded: {df_final.shape}")
        
        #create context lookup table
        user_input_cols = ['subtype', 'price_range', 'five_year_survivor']
        context_cols = [c for c in df_final.columns if c not in user_input_cols]
        zip_context_df = df_final[context_cols].drop_duplicates(subset=['zip_code']).set_index('zip_code')
        print(f"Context lookup created for {len(zip_context_df)} zip codes")
        
        print(f"Constants loaded: {len(RESTAURANT_SUBTYPES)} subtypes, {len(AVAILABLE_ZIP_CODES)} zip codes")
        print("Startup complete")
        
    except Exception as e:
        raise

# Health check endpoint
@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint - verify API is running and model is loaded"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "data_loaded": df_final is not None,
        "total_zip_codes": len(AVAILABLE_ZIP_CODES),
        "available_subtypes": RESTAURANT_SUBTYPES
    }

def predict_single_zip(zip_code: str, subtype: str, price_range: float) -> Optional[dict]:
    """
    Predict opportunity score for a single zip code
    Returns None if prediction fails
    """
    try:
        zip_code = str(zip_code).strip()
        
        if zip_code not in zip_context_df.index:
            return None
        

        context_data = zip_context_df.loc[zip_code].copy()
        

        input_row = pd.DataFrame([context_data])
        input_row['zip_code'] = zip_code
        input_row['subtype'] = subtype
        input_row['price_range'] = float(price_range)

        probability = model.predict_proba(input_row)[0][1]
        score_percent = round(probability * 100, 1)
        
        if score_percent >= 70:
            rating = "High Opportunity"
        elif score_percent >= 50:
            rating = "Moderate Opportunity"
        else:
            rating = "Low Opportunity"
        
        return {
            "zip_code": zip_code,
            "opportunity_score": round(probability, 4),
            "score_percent": score_percent,
            "rating": rating,
            "restaurant_type": f"{subtype} (Price: {'$' * int(price_range)})"
        }
    
    except Exception as e:
        print(f"Error predicting for zip {zip_code}: {e}")
        return None


# main prediction endpoint - by city
@app.post("/predict", response_model=OpportunityResponse)
async def predict_by_city(request: CityOpportunityRequest):
    """
    Predict opportunity scores for all zip codes in a city
    
    Parameters:
    - city: City name (e.g., "Philadelphia")
    - state: Optional state code (e.g., "PA")
    - subtype: Restaurant type (e.g., "Italian", "Mexican", "Pizza")
    - price_range: Price level from 1.0 (cheapest) to 4.0 (most expensive)
    
    Returns:
    - List of opportunity scores for each zip code in the city
    """
    
    if model is None or df_final is None or zip_context_df is None:
        raise HTTPException(status_code=503, detail="Model or data not loaded")
    
    zip_codes = get_zip_codes_for_city(request.city, request.state)
    
    if not zip_codes:
        raise HTTPException(
            status_code=404,
            detail=f"No zip codes found for city: {request.city}" + 
                   (f", {request.state}" if request.state else "") +
                   ". Try adding a state code or check /cities for available cities."
        )
    

    results = []
    for zip_code in zip_codes:
        prediction = predict_single_zip(zip_code, request.subtype, request.price_range)
        if prediction:
            results.append(prediction)
    
    if not results:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate predictions for any zip codes"
        )
    
    return {
        "city": request.city,
        "state": request.state,
        "subtype": request.subtype,
        "price_range": request.price_range,
        "total_zip_codes": len(results),
        "zip_scores": results
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
