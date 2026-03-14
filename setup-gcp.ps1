# Configuration
$PROJECT_ID = "abiding-state-443313-a8"  # ← UPDATE THIS

Write-Host "Setting up GCP for project: $PROJECT_ID" -ForegroundColor Cyan

# Enable APIs
Write-Host "Enabling APIs..." -ForegroundColor Yellow
gcloud services enable iam.googleapis.com cloudresourcemanager.googleapis.com run.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com

# Create service account
Write-Host "Creating service account..." -ForegroundColor Yellow
gcloud iam service-accounts create "github-actions-sa" `
  --project="$PROJECT_ID" `
  --display-name="GitHub Actions Service Account"

# Grant permissions
Write-Host "Granting permissions..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding "$PROJECT_ID" `
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" `
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" `
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" `
  --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" `
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" `
  --role="roles/secretmanager.admin"

# Generate key
Write-Host "Generating service account key..." -ForegroundColor Yellow
gcloud iam service-accounts keys create "github-actions-key.json" `
  --iam-account="github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" `
  --project="$PROJECT_ID"

# Output instructions
Write-Host ""
Write-Host "===================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open github-actions-key.json and copy ALL its contents"
Write-Host "2. Go to GitHub → Your repo → Settings → Secrets → Actions"
Write-Host "3. Add new secret: GCP_SERVICE_ACCOUNT_KEY"
Write-Host "4. Paste the JSON contents"
Write-Host "5. Add another secret: GCP_PROJECT_ID = $PROJECT_ID"
Write-Host ""
Write-Host "Service Account: github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Green