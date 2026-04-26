# Stage 1: Build dependencies
FROM python:3.11-slim as builder

WORKDIR /code

# Install system build dependencies for Pillow/Image libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libjpeg-dev \
    zlib1g-dev \
    libfreetype6-dev \
    libharfbuzz-dev \
    libfribidi-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies to a temporary folder
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Final Runtime Image
FROM python:3.11-slim

# Set environment variables for production
ARG BACKEND_PORT=8000
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/appuser/.local/bin:${PATH}" \
    TZ=Asia/Dhaka \
    PORT=${BACKEND_PORT}

# Install only the runtime shared libraries needed for image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    libjpeg62-turbo \
    libfreetype6 \
    libharfbuzz0b \
    libfribidi0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a non-privileged user for security
RUN useradd -m appuser
USER appuser
WORKDIR /home/appuser/app

# Copy installed python packages from the builder stage
COPY --from=builder /root/.local /home/appuser/.local
# Copy application code
COPY --chown=appuser:appuser . .

# Expose port
EXPOSE ${PORT}

# Production command using Gunicorn with Uvicorn workers for high concurrency
# workers = (2 x $num_cores) + 1
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]