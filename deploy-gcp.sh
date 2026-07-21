#!/bin/bash

# Google Cloud Run Deployment Script for Maintix API
# Usage: ./deploy-gcp.sh [PROJECT_ID] [REGION]

set -e

# Configuration
PROJECT_ID=${1:-$(gcloud config get-value project)}
REGION=${2:-asia-south1}
SERVICE_NAME="maintix-api"
REGISTRY="asia-south1-docker.pkg.dev"
REPOSITORY="maintix-api"

echo "🚀 Deploying Maintix API to Google Cloud Run"
echo "=============================================="
echo "Project: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo "Service: ${SERVICE_NAME}"
echo ""

# Check if project is set
if [ -z "${PROJECT_ID}" ]; then
    echo "❌ Error: No project ID specified"
    echo "Usage: ./deploy-gcp.sh [PROJECT_ID] [REGION]"
    echo "Or set it with: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

# Step 0: Enable required services
echo "🔧 Enabling required GCP services..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  --project="${PROJECT_ID}" 2>/dev/null || true

# Step 1: Build Docker image via Cloud Build
echo "📦 Building Docker image..."
gcloud builds submit \
  --config cloudbuild.yaml \
  --project="${PROJECT_ID}" \
  --substitutions=_REGISTRY=${REGISTRY},_REPOSITORY=${REPOSITORY},_SERVICE=${SERVICE_NAME}

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
echo ""
echo "⚠️  Before deploying, make sure you have set up your secrets:"
echo "   gcloud secrets create maintix-env --data-file=.env.production"
echo "   (or use --set-env-vars with each variable)"
echo ""

gcloud run deploy ${SERVICE_NAME} \
  --image ${REGISTRY}/${PROJECT_ID}/${REPOSITORY}/${SERVICE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 80 \
  --timeout 300 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars="NODE_ENV=production,PORT=8080"

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "✅ Deployment successful!"
echo ""

# Step 3: Get service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --format='value(status.url)')

echo "🌐 Service URL: ${SERVICE_URL}"
echo ""
echo "⚠️  Set remaining environment variables via:"
echo "   gcloud run services update ${SERVICE_NAME} \\"
echo "     --region ${REGION} \\"
echo "     --set-env-vars=\"DATABASE_URL=...,JWT_SECRET=...,SUPABASE_URL=...,SUPABASE_SERVICE_KEY=...,CORS_ORIGIN=...\""
echo ""
echo "🎉 Deployment complete!"
