terraform {
  cloud {

    organization = "DCSC-Project"

    workspaces {
      name = "default-workspace"
    }
  }
}

provider "google" {
  credentials = var.GOOGLE_CREDENTIALS
  project     = "third-arcadia-434000-s5"
  region      = "us-east1"
}

# Create a GKE Cluster
resource "google_container_cluster" "primary" {
  name     = "study-group-cluster"
  location = "us-east1"

  initial_node_count = 1
  node_config {
    machine_type = "e2-micro"
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
