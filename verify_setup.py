#!/usr/bin/env python3
"""
Setup Verification Script
Checks that all files and dependencies are in place before running the application
"""

import sys
import os
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists and report status"""
    if os.path.exists(filepath):
        print(f"   ✓ {description}")
        return True
    else:
        print(f"   ✗ {description} - NOT FOUND: {filepath}")
        return False

def check_directory_exists(dirpath, description):
    """Check if a directory exists and report status"""
    if os.path.isdir(dirpath):
        print(f"   ✓ {description}")
        return True
    else:
        print(f"   ✗ {description} - NOT FOUND: {dirpath}")
        return False

def check_python_packages():
    """Check if required Python packages are installed"""
    print("\n2. Checking Python Dependencies...")
    
    required_packages = [
        ('fastapi', 'FastAPI'),
        ('uvicorn', 'Uvicorn'),
        ('pandas', 'Pandas'),
        ('numpy', 'NumPy'),
        ('joblib', 'Joblib'),
        ('xgboost', 'XGBoost'),
        ('pydantic', 'Pydantic')
    ]
    
    all_installed = True
    for package, name in required_packages:
        try:
            __import__(package)
            print(f"   ✓ {name} installed")
        except ImportError:
            print(f"   ✗ {name} NOT INSTALLED")
            all_installed = False
    
    return all_installed

def check_frontend_files():
    """Check frontend files"""
    print("\n4. Checking Frontend Files...")
    
    all_present = True
    frontend_files = [
        ('frontend/index.html', 'Frontend HTML'),
        ('frontend/app.js', 'Frontend JavaScript'),
        ('frontend/README.md', 'Frontend README')
    ]
    
    for filepath, description in frontend_files:
        if not check_file_exists(filepath, description):
            all_present = False
    
    return all_present

def main():
    print("=" * 70)
    print("Restaurant Opportunity Score Analyzer - Setup Verification")
    print("=" * 70)
    
    all_checks_passed = True
    
    # Check 1: Core files
    print("\n1. Checking Core Files...")
    core_files = [
        ('api.py', 'API Server'),
        ('constants.py', 'Constants Module'),
        ('restaurant_row_data.csv', 'Restaurant Data'),
        ('model/xgboost_untuned_model.pkl', 'ML Model'),
        ('requirements.txt', 'Requirements File')
    ]
    
    for filepath, description in core_files:
        if not check_file_exists(filepath, description):
            all_checks_passed = False
    
    # Check 2: Python packages
    if not check_python_packages():
        all_checks_passed = False
        print("\n   To install dependencies, run:")
        print("   pip install -r requirements.txt")
    
    # Check 3: Data directories
    print("\n3. Checking Data Directories...")
    if not check_directory_exists('model', 'Model Directory'):
        all_checks_passed = False
    if not check_directory_exists('yelp_dataset', 'Yelp Dataset'):
        print("   ⚠️  Warning: Yelp dataset not found (optional for inference)")
    if not check_directory_exists('census_dataset', 'Census Dataset'):
        print("   ⚠️  Warning: Census dataset not found (optional for inference)")
    
    # Check 4: Frontend files
    if not check_frontend_files():
        all_checks_passed = False
    
    # Check 5: Startup scripts
    print("\n5. Checking Startup Scripts...")
    check_file_exists('start_app.sh', 'Mac/Linux Startup Script')
    check_file_exists('start_app.bat', 'Windows Startup Script')
    
    # Check 6: Documentation
    print("\n6. Checking Documentation...")
    check_file_exists('README.md', 'Main README')
    check_file_exists('API_SUMMARY.md', 'API Documentation')
    
    # Final report
    print("\n" + "=" * 70)
    if all_checks_passed:
        print("✅ All essential checks passed!")
        print("\nYou're ready to start the application:")
        print("\n  Option 1 (Easy): Run the startup script")
        print("    Mac/Linux: ./start_app.sh")
        print("    Windows:   start_app.bat")
        print("\n  Option 2 (Manual):")
        print("    1. python api.py")
        print("    2. cd frontend && python -m http.server 8080")
        print("\n  Then open: http://localhost:8080")
    else:
        print("❌ Some checks failed!")
        print("\nPlease fix the issues above before running the application.")
        
        if not check_python_packages():
            print("\nTo install Python dependencies:")
            print("  pip install -r requirements.txt")
    
    print("=" * 70)
    print()
    
    return 0 if all_checks_passed else 1

if __name__ == "__main__":
    sys.exit(main())

