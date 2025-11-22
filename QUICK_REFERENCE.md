# Quick Reference Card

## Start Everything (2 Commands)

**Terminal 1 - Backend:**
```bash
cd cse-6242-restaurant-selection
source venv/bin/activate
python api.py
```

**Terminal 2 - Frontend:**
```bash
cd cse-6242-restaurant-selection/frontend
python -m http.server 8080
```

**Browser:** http://localhost:8080

---

## Stop Everything

```bash
# Kill API
lsof -ti:8000 | xargs kill -9

# Kill Frontend  
lsof -ti:8080 | xargs kill -9
```

---

## Test Everything

```bash
cd cse-6242-restaurant-selection
source venv/bin/activate
python test_api.py
```

---

## Check Status

```bash
# Check API
curl http://localhost:8000/

# Check Frontend
curl http://localhost:8080/

# Verify Setup
python verify_setup.py
```

---

## URLs

- **Frontend**: http://localhost:8080
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📖 Documentation

- **Setup Guide**: `SETUP.md`
- **Status Update**: `STATUS_UPDATE.md`
- **Frontend Docs**: `frontend/README.md`
- **Quick Reference**: This file

---

## Example Test Case

1. City: **Philadelphia, PA**
2. Type: **Italian**
3. Price: **$$ (Moderate)**
4. Expected: ~71 ZIP codes, scores 20-93%

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Port in use | `lsof -ti:8000 \| xargs kill -9` |
| Module not found | `pip install -r requirements.txt` |
| API not responding | Check `python api.py` is running |
| Frontend blank | Check browser console (F12) |

---

## One-Liner Commands

```bash
# Check API health
curl -s http://localhost:8000/ | python -m json.tool

# Test prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"city":"Philadelphia","state":"PA","subtype":"Italian","price_range":2.0}'

# View API logs
tail -f /tmp/api.log

# Restart everything
lsof -ti:8000 | xargs kill -9; lsof -ti:8080 | xargs kill -9; \
  cd cse-6242-restaurant-selection && \
  source venv/bin/activate && \
  python api.py &
```

---

## Pre-Demo Checklist

- [ ] API running (`python api.py`)
- [ ] Frontend running (`python -m http.server 8080`)
- [ ] Browser open to http://localhost:8080
- [ ] Test one example successfully
- [ ] Know which city to demo (Philadelphia recommended)

---

*Keep this file open during development!*

