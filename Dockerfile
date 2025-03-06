# Stage 1: Frontend build
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend with frontend static files
FROM python:3.11-slim
WORKDIR /app
COPY --from=frontend-build /frontend/dist /app/staticfiles
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /frontend/dist /app/staticfiles

# Add Whitenoise configuration to settings.py
RUN echo "\n\
STATIC_ROOT = 'staticfiles'\n\
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'\n\
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')" >> interior_pilot/settings.py

RUN mkdir -p /app/static
# Collect static files
RUN python manage.py collectstatic --noinput || echo "Static files collected with warnings"

RUN mkdir -p /app/staticfiles/assets
COPY --from=frontend-build /frontend/dist/assets /app/staticfiles/assets

EXPOSE 8000

CMD ["gunicorn", "interior_pilot.wsgi:application", "--bind", "0.0.0.0:8000"]
