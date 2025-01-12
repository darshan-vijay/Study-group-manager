# Study Group Manager - Studious

## Team 28

**Members:**

- Darshan Vijayaraghavan
- Ruban Chakaravarthi
- Vignesh Kumar Karthikeyan

---

## Project Overview

The **Study Group Manager** application facilitates students in forming study groups based on their preferences, schedules, and courses. It leverages Google Cloud Platform (GCP) for infrastructure, Kubernetes for orchestration, Terraform for infrastructure automation, and RabbitMQ for service decoupling. This document provides step-by-step instructions to set up and deploy the project.

---

## Youtube Overview

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/hWxHUJqYAns/0.jpg)](https://www.youtube.com/watch?v=hWxHUJqYAns)

## Prerequisites

Before you begin, ensure you have the following:

- A Google Cloud Platform account.
- Terraform Cloud account.
- Google Cloud SDK (`gcloud` CLI).
- Kubernetes CLI (`kubectl`).
- Docker installed on your local system.

---

## Setup Instructions

### 1. Create a Service Account

1. **Create a Service Account**:

   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Navigate to **IAM & Admin** > **Service Accounts**.
   - Click **Create Service Account** and fill in the required details.

2. **Assign Roles**:

   - Assign the `Editor` role to the service account for simplicity, or assign specific roles such as:
     - Compute Admin
     - Kubernetes Engine Admin
     - Firestore Admin
     - Storage Admin

3. **Download the Service Account Key**:
   - Once the service account is created, generate a key in JSON format and download it to your local machine.

### 2. Set Up Terraform Cloud

1. **Create an Account**:

   - Sign up for a free account on [Terraform Cloud](https://app.terraform.io/).

2. **Create a Workspace**:

   - Create a project and a workspace in Terraform Cloud.

3. **Store Service Account Key**:
   - Log in to Terraform Cloud.
   - Navigate to **Workspace Settings** > **Variables**.
   - Add a variable named `GOOGLE_CREDENTIALS` and upload the service account JSON key.

### 3. Configure Terraform

1. **Navigate to Terraform Directory**:

   - Open a terminal and navigate to the directory containing the `main.tf` file.

2. **Initialize Terraform**:

   ```bash
   terraform init
   ```

3. **Preview Infrastructure Changes**:

   ```bash
   terraform plan
   ```

   This command shows the resources that Terraform will create.

4. **Apply Terraform Configuration**:
   ```bash
   terraform apply
   ```
   Confirm the changes when prompted. Terraform will create the necessary GCP resources.

---

### 4. Authenticate with Google Cloud CLI

1. **Install Google Cloud SDK**:

   - Follow the installation guide [here](https://cloud.google.com/sdk/docs/install).

2. **Authenticate with GCP**:

   ```bash
   gcloud auth login
   ```

3. **Set Active Project**:

   ```bash
   gcloud config set project [PROJECT_ID]
   ```

4. **Connect to Kubernetes Cluster**:
   ```bash
   gcloud container clusters get-credentials [CLUSTER_NAME] --zone [ZONE_NAME]
   ```

---

### 5. Deploy Kubernetes Services

1. Ensure the Terraform infrastructure is deployed and the Kubernetes cluster is running.
2. Deploy all Kubernetes services using the provided script:

   ```bash
   ./deploy-services.sh
   ```

3. Verify the services are running:
   ```bash
   kubectl get services
   ```

---

### 6. Configure Backend and Frontend Deployments

1. **Retrieve External Endpoints**:

   - Run the following command to fetch external service endpoints:
     ```bash
     kubectl get services
     ```

2. **Update Configurations**:
   - Navigate to the `backend` and `frontend` directories.
   - Update the configuration files with the service endpoints obtained in the previous step.

---

### 7. Deploy Kubernetes Deployments

1. Deploy all required Kubernetes deployments using the provided script:

   ```bash
   ./deploy-deployments.sh
   ```

2. Verify the deployments are running:
   ```bash
   kubectl get deployments
   ```

---

### 8. Push Docker Images (Optional)

If you want to push Docker images to **Google Kubernetes Registry (GKR)** before deploying, use the commands in the `commands-for-running-cluster` file.

Example:

```bash
docker build -t gcr.io/[PROJECT_ID]/[IMAGE_NAME]:[TAG] .
docker push gcr.io/[PROJECT_ID]/[IMAGE_NAME]:[TAG]
```

---

### 9. Install RabbitMQ

1. Use the `commands-for-running-cluster` file to install RabbitMQ on the VM instance.
   Example:

   ```bash
   sudo apt-get update
   sudo apt-get install rabbitmq-server -y
   sudo systemctl start rabbitmq-server
   sudo systemctl enable rabbitmq-server
   ```

2. Verify RabbitMQ installation:
   ```bash
   sudo rabbitmqctl status
   ```

---

### 10. Access the Application

1. Use the service endpoint of the `frontend-service` to access the application.
2. Retrieve the endpoint:
   ```bash
   kubectl get services | grep frontend-service
   ```
3. Open the retrieved endpoint in your web browser to use the application.

---

## Additional Notes

- Ensure all required environment variables are set before running the scripts.
- Regularly monitor the Kubernetes cluster for any issues using:
  ```bash
  kubectl get pods
  ```
- Logs can be viewed using:
  ```bash
  kubectl logs [POD_NAME]
  ```
