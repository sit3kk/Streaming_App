# Use an official Python runtime as a parent image
FROM python:3.12.2-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY djangoproj/requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY djangoproj/ /app/

# Expose the port the app runs on
EXPOSE 8000

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
