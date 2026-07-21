# Google Cloud Run Deployment Script for Maintix API (PowerShell)
# Usage: .\deploy-gcp.ps1 -ProjectId "your-project" -Region "asia-south1"

param(
    [string]$ProjectId = (gcloud config get-value project),
    [string]$Region = "asia-south1",
    [string]$ServiceName = "maintix-api"
)

$ErrorActionPreference = "Stop"

$Registry = "asia-south1-docker.pkg.dev"
$Repository = "maintix-api"

Write-Host "Deploying Maintix API to Google Cloud Run" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host "Project: $ProjectId"
Write-Host "Region: $Region"
Write-Host "Service: $ServiceName"
Write-Host ""

# Check if project is set
if ([string]::IsNullOrEmpty($ProjectId)) {
    Write-Host "Error: No project ID specified" -ForegroundColor Red
    Write-Host "Usage: .\deploy-gcp.ps1 -ProjectId 'your-project' -Region 'asia-south1'"
    Write-Host "Or set it with: gcloud config set project YOUR_PROJECT_ID"
    exit 1
}

# Step 0: Enable required services
Write-Host "Enabling required GCP services..." -ForegroundColor Yellow
& gcloud services enable `
    run.googleapis.com `
    cloudbuild.googleapis.com `
    artifactregistry.googleapis.com `
    --project="$ProjectId" 2>$null

# Step 1: Build Docker image via Cloud Build
Write-Host "Building Docker image..." -ForegroundColor Yellow
& gcloud builds submit `
    --config cloudbuild.yaml `
    --project="$ProjectId" `
    --substitutions="_REGISTRY=$Registry,_REPOSITORY=$Repository,_SERVICE=$ServiceName"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..." -ForegroundColor Yellow
Write-Host ""

& gcloud run deploy $ServiceName `
  --image "${Registry}/${ProjectId}/${Repository}/${ServiceName}:latest" `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --concurrency 80 `
  --timeout 300 `
  --min-instances 0 `
  --max-instances 10 `
  --set-env-vars="NODE_ENV=production,PORT=8080"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Deployment successful!" -ForegroundColor Green
Write-Host ""

# Step 3: Get service URL
$ServiceUrl = & gcloud run services describe $ServiceName `
  --platform managed `
  --region $Region `
  --format='value(status.url)'

Write-Host "Service URL: $ServiceUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Set remaining env vars via:"
Write-Host "  gcloud run services update $ServiceName --region $Region --set-env-vars=DATABASE_URL=...,JWT_SECRET=...,SUPABASE_URL=...,SUPABASE_SERVICE_KEY=...,CORS_ORIGIN=..."
Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
