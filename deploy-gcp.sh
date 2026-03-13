#!/bin/bash

# Google Cloud Run Deployment Script for Maintix API
# Usage: ./deploy-gcp.sh [PROJECT_ID] [REGION]

set -e

# Configuration
PROJECT_ID=${1:-$(gcloud config get-value project)}
REGION=${2:-us-central1}
SERVICE_NAME="maintix-api"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

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

# Step 1: Build Docker image
echo "📦 Building Docker image..."
gcloud builds submit --tag ${IMAGE_NAME}:latest --machine-type=e2-highcpu-32

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 80 \
  --timeout 300 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars="NODE_ENV=production" \
  --add-cloudsql-instances=${PROJECT_ID}:${REGION}:maintix-db \
  --service-account=maintix-api@${PROJECT_ID}.iam.gserviceaccount.com

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

# Step 4: Run database migrations
echo "🗄️ Running database migrations..."
gcloud run services update-traffic ${SERVICE_NAME} \
  --to-latest \
  --platform managed \
  --region ${REGION}

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Cloud Run console"
echo "2. Run: gcloud run services update ${SERVICE_NAME} --set-env-vars DATABASE_URL=your_url"
echo "3. Test the API: curl ${SERVICE_URL}/health"
echo "4. Update frontend .env with: NEXT_PUBLIC_API_URL=${SERVICE_URL}"
echo ""
