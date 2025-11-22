"""
Test script to verify frontend-backend integration
This script tests the API endpoints that the frontend uses
"""

import requests
import json
import sys

API_BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("\n1. Testing Health Check Endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   [OK] Status: {data['status']}")
            print(f"   [OK] Model loaded: {data['model_loaded']}")
            print(f"   [OK] Data loaded: {data['data_loaded']}")
            print(f"   [OK] Total zip codes: {data['total_zip_codes']}")
            print(f"   [OK] Available subtypes: {len(data['available_subtypes'])}")
            return True
        else:
                print(f"   [ERROR] Status code {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"   [ERROR] Could not connect to API at {API_BASE_URL}")
        print(f"   Make sure the API is running with: python api.py")
        return False
    except Exception as e:
        print(f"   [ERROR] {e}")
        return False

def test_predict_endpoint():
    """Test the predict endpoint with sample data"""
    print("\n2. Testing Predict Endpoint...")
    
    test_cases = [
        {
            "name": "Philadelphia Italian Restaurant",
            "data": {
                "city": "Philadelphia",
                "state": "PA",
                "subtype": "Italian",
                "price_range": 2.0
            }
        },
        {
            "name": "Tampa Mexican Restaurant",
            "data": {
                "city": "Tampa",
                "state": "FL",
                "subtype": "Mexican",
                "price_range": 1.0
            }
        },
        {
            "name": "Nashville American Restaurant",
            "data": {
                "city": "Nashville",
                "state": "TN",
                "subtype": "American",
                "price_range": 3.0
            }
        }
    ]
    
    all_passed = True
    
    for test_case in test_cases:
        print(f"\n   Testing: {test_case['name']}")
        try:
            response = requests.post(
                f"{API_BASE_URL}/predict",
                json=test_case['data'],
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"   [OK] City: {data['city']}, {data['state']}")
                print(f"   [OK] Restaurant: {data['subtype']} (Price: {'$' * int(data['price_range'])})")
                print(f"   [OK] ZIP codes analyzed: {data['total_zip_codes']}")
                
                if data['zip_scores']:
                    scores = [z['score_percent'] for z in data['zip_scores']]
                    avg_score = sum(scores) / len(scores)
                    max_score = max(scores)
                    print(f"   [OK] Average score: {avg_score:.1f}%")
                    print(f"   [OK] Highest score: {max_score:.1f}%")
                    
                    # Show top 3 zip codes
                    top_zips = sorted(data['zip_scores'], key=lambda x: x['score_percent'], reverse=True)[:3]
                    print(f"   [OK] Top 3 ZIP codes:")
                    for i, z in enumerate(top_zips, 1):
                        print(f"      {i}. ZIP {z['zip_code']}: {z['score_percent']}% ({z['rating']})")
                else:
                    print(f"   [ERROR] No zip scores returned")
                    all_passed = False
            else:
                print(f"   [ERROR] Status code {response.status_code}")
                print(f"   Response: {response.text}")
                all_passed = False
                
        except Exception as e:
            print(f"   [ERROR] {e}")
            all_passed = False
    
    return all_passed

def test_invalid_requests():
    """Test API error handling"""
    print("\n3. Testing Error Handling...")
    
    # Test with invalid city
    print("\n   Testing invalid city...")
    try:
        response = requests.post(
            f"{API_BASE_URL}/predict",
            json={
                "city": "InvalidCity",
                "state": "XX",
                "subtype": "Italian",
                "price_range": 2.0
            },
            timeout=10
        )
        
        if response.status_code == 404:
            print(f"   [OK] Correctly rejected invalid city (404)")
        else:
            print(f"   [ERROR] Unexpected status code: {response.status_code}")
            
    except Exception as e:
        print(f"   [ERROR] {e}")
    
    # Test with invalid price range
    print("\n   Testing invalid price range...")
    try:
        response = requests.post(
            f"{API_BASE_URL}/predict",
            json={
                "city": "Philadelphia",
                "state": "PA",
                "subtype": "Italian",
                "price_range": 5.0  # Invalid (should be 1-4)
            },
            timeout=10
        )
        
        if response.status_code == 422:
            print(f"   [OK] Correctly rejected invalid price range (422)")
        else:
            print(f"   [WARNING] Status code: {response.status_code} (expected 422)")
            
    except Exception as e:
        print(f"   [ERROR] {e}")

def main():
    print("=" * 60)
    print("Chef's Kiss API - Integration Test")
    print("=" * 60)
    
    # Test health check
    if not test_health_check():
        print("\n❌ Health check failed. Make sure the API is running.")
        print("   Start the API with: python api.py")
        sys.exit(1)
    
    # Test predict endpoint
    if test_predict_endpoint():
        print("\n[OK] Predict endpoint tests passed!")
    else:
        print("\n[WARNING] Some predict endpoint tests failed")
    
    # Test error handling
    test_invalid_requests()
    
    print("\n" + "=" * 60)
    print("[OK] Integration tests complete!")
    print("=" * 60)
    print("\nThe frontend should work correctly with the API.")
    print("Start the frontend with: cd frontend && python -m http.server 8080")
    print("\n")

if __name__ == "__main__":
    main()

