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

resource "google_container_cluster" "primary" {
  name     = "study-group-cluster"
  location = "us-east1"

  remove_default_node_pool = true
  initial_node_count       = 1

  node_config {
    machine_type = "e2-medium"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "primary-node-pool"
  location   = "us-east1"
  cluster    = google_container_cluster.primary.name
  node_count = 1

  node_config {
    machine_type = "e2-medium"
  }

  lifecycle {
    prevent_destroy = false
  }
}

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

  lifecycle {
    prevent_destroy = false
  }
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

  lifecycle {
    prevent_destroy = false
  }
}

resource "google_firestore_database" "database" {
  name                    = "study-group-db"
  location_id             = "nam5"
  type                    = "FIRESTORE_NATIVE"
  delete_protection_state = "DELETE_PROTECTION_DISABLED"
  deletion_policy         = "DELETE"

  lifecycle {
    prevent_destroy = false
  }
}
