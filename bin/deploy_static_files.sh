#!/bin/bash
set -eu

STAGE="${1:-dev}"
echo "Deploying static assets to ${STAGE}..."
echo "Bucket URL: rynohub-free-${STAGE}"

BUCKET_NAME=$(aws \
    cloudformation describe-stacks \
    --stack-name "rynohub-free-${STAGE}" \
    --query "Stacks[0].Outputs[?OutputKey=='WebSiteBucket'] | [0].OutputValue" \
    --profile "default" \
    --region "us-east-1" \
    --output text)


WEBSITE_URL=$(aws \
    cloudformation describe-stacks \
    --stack-name "rynohub-free-${STAGE}" \
    --query "Stacks[0].Outputs[?OutputKey=='WebSiteUrl'] | [0].OutputValue" \
    --profile "default" \
    --region "us-east-1" \
    --output text)

echo "Bucket URL: ${WEBSITE_URL}"

aws s3 sync --acl 'public-read' --delete ./static/ "s3://${BUCKET_NAME}/"

echo "Bucket URL: ${WEBSITE_URL}"
