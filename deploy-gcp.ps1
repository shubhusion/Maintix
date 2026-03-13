# Google Cloud Run Deployment Script for Maintix API (PowerShell)
# Usage: .\deploy-gcp.ps1 -ProjectId "your-project" -Region "us-central1"

param(
    [string]$ProjectId = (gcloud config get-value project),
    [string]$Region = "us-central1",
    [string]$ServiceName = "maintix-api"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying Maintix API to Google Cloud Run" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host "Project: $ProjectId"
Write-Host "Region: $Region"
Write-Host "Service: $ServiceName"
Write-Host ""

# Check if project is set
if ([string]::IsNullOrEmpty($ProjectId)) {
    Write-Host "❌ Error: No project ID specified" -ForegroundColor Red
    Write-Host "Usage: .\deploy-gcp.ps1 -ProjectId 'your-project' -Region 'us-central1'"
    Write-Host "Or set it with: gcloud config set project YOUR_PROJECT_ID"
    exit 1
}

$ImageName = "gcr.io/${ProjectId}/${ServiceName}"

# Step 1: Build Docker image
Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
& gcloud builds submit --tag "${ImageName}:latest" --machine-type="e2-highcpu-32"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Deploy to Cloud Run
Write-Host "☁️ Deploying to Cloud Run..." -ForegroundColor Yellow
& gcloud run deploy $ServiceName `
  --image "${ImageName}:latest" `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --concurrency 80 `
  --timeout 300 `
  --min-instances 0 `
  --max-instances 10 `
  --set-env-vars="NODE_ENV=production"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""

# Step 3: Get service URL
$ServiceUrl = & gcloud run services describe $ServiceName `
  --platform managed `
  --region $Region `
  --format='value(status.url)'

Write-Host "🌐 Service URL: $ServiceUrl" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Set environment variables in Cloud Run console"
Write-Host "2. Run: gcloud run services update $ServiceName --set-env-vars DATABASE_URL=your_url"
Write-Host "3. Test the API: curl $ServiceUrl/health"
Write-Host "4. Update frontend .env with: NEXT_PUBLIC_API_URL=$ServiceUrl"
Write-Host ""
