#!/usr/bin/env bash
# Deploy KlausulKu to Cloud Run (Cloud Build — works in Google Cloud Shell).
set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-klausulku}"
REGION="${GCP_REGION:-asia-southeast2}"
SERVICE="${CLOUD_RUN_SERVICE:-klausulku}"

if [[ -z "${VITE_GEMINI_API_KEY:-}" ]]; then
  echo "Error: set VITE_GEMINI_API_KEY before running."
  echo '  export VITE_GEMINI_API_KEY="your-key"'
  exit 1
fi

echo "→ Project: $PROJECT_ID | Region: $REGION | Service: $SERVICE"

gcloud config set project "$PROJECT_ID"

echo "→ Enabling required APIs (safe to re-run)..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  --quiet

echo "→ Ensuring Artifact Registry repo exists..."
if ! gcloud artifacts repositories describe cloud-run-source-deploy \
  --location="$REGION" &>/dev/null; then
  gcloud artifacts repositories create cloud-run-source-deploy \
    --repository-format=docker \
    --location="$REGION" \
    --description="KlausulKu Cloud Run images"
fi

BACKUP_SUB="${VITE_GEMINI_API_KEY_BACKUP:-}"

echo "→ Building & deploying (5–10 menit)..."
gcloud builds submit --config cloudbuild.yaml \
  --substitutions="_VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY},_VITE_GEMINI_API_KEY_BACKUP=${BACKUP_SUB},_VITE_GCP_PROJECT_ID=483216655534,_REGION=${REGION},_SERVICE=${SERVICE}"

echo ""
echo "✓ Deploy selesai. URL service:"
gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)'
