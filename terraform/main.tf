terraform {
  cloud {

    organization = "DCSC-Project"

    workspaces {
      name = "default-workspace"
    }
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

}

provider "google" {
  credentials = var.GOOGLE_CREDENTIALS
  project     = "unified-freedom-443118-s0"
  region      = "us-east1"
}

# Create a GKE Cluster
# switch off delete protection
resource "google_container_cluster" "primary" {
  name     = "study-group-cluster"
  location = "us-east1"

  initial_node_count = 1
  node_config {
    machine_type = "e2-micro"
  }
  lifecycle {
    prevent_destroy = false
  }
}

# Create a Compute Instance
resource "google_compute_instance" "vm_instance" {
  name         = "rabbit-instance"
  machine_type = "e2-micro"
  zone         = "us-east1-c"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }
}

resource "google_firestore_database" "database" {
  name                    = "(default)"
  location_id             = "nam5"
  type                    = "FIRESTORE_NATIVE"
  delete_protection_state = "DELETE_PROTECTION_DISABLED"
  deletion_policy         = "DELETE"
}

resource "google_storage_bucket" "default" {
  name          = "study-group-bucket"
  location      = "US"
  storage_class = "STANDARD"

  lifecycle_rule {
    condition {
      age        = 30
      with_state = "LIVE"
    }
    action {
      type = "Delete"
    }
  }

  versioning {
    enabled = true
  }

  labels = {
    environment = "dev"
    team        = "engineering"
  }
}

