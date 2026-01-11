# Use a lightweight Python base image
FROM python:3.10-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements first (for caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code, templates, and static files
COPY app.py .
COPY model.pkl .
COPY templates/ ./templates/
COPY static/ ./static/

# (Optional) Copy dataset if needed
# COPY FakeNewsNet.csv .

# Expose Flask/Gunicorn port
EXPOSE 5000

# Run using Gunicorn (production server)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
