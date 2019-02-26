#!/usr/bin/env bash

set +x
echo "${DEPLOY_KEY}" | base64 --decode > deploy_key
chmod 600 deploy_key
eval $(ssh-agent -s)
ssh-add deploy_key
rm deploy_key
set -x

REPO=$(git config remote.origin.url)
SSH_REPO="${REPO/https:\/\/github.com\//git@github.com:}"
SHA=$(git rev-parse --verify HEAD)

cd dist/
git init
git remote add origin "${SSH_REPO}"
git checkout -b "${TARGET_BRANCH}"
git config user.name "Travis CI"
git config user.email "${COMMIT_AUTHOR_EMAIL}"
git add .
git commit -m "Deploy to GitHub Pages: ${SHA}"
git push --force origin ${TARGET_BRANCH}
