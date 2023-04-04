# Living Memories Demo

## Intro

This code was used to demo the Living Memories at the IUI2023 conference. It uses Docker to containarize the backend code, deploys it to AWS ECR, and uses the Serverless framework to create a Lambda to serve the API.

## Requirements

- Docker

- AWS CLI (configured with `aws configure`-_access key id_ and _secret access key_ shared within the lab)

- `<account_id>` shared within the lab

## Steps to deploy the API

1. Update the OpenAI API key in `app.py`, on line 11.

1. **Build the docker image:** `docker build -t livingmemoryapi . --platform=linux/amd64`

1. **Authenticate the docker CLI with AWS ECR:** `docker login -u AWS -p $(aws ecr get-login-password --region us-east-1) <account_id>.dkr.ecr.us-east-1.amazonaws.com`

1. **Tag the Docker image:** `docker tag livingmemoryapi <account_id>.dkr.ecr.us-east-1.amazonaws.com/livingmemoryapi-repo`

1. **Push the Docker image:** `docker push <account_id>.dkr.ecr.us-east-1.amazonaws.com/livingmemoryapi-repo`. This will return an _Image Digest_, save it.

1. In `serverless.yml`, on line 11, replace `<account_id>` with the Account ID, and `<image_digest>` with the Image Digest obtained in the previous step.

1. **Deploy the serverless stack:** `serverless deploy`