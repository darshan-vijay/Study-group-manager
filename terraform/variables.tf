variable "GOOGLE_CREDENTIALS" {
  type      = string
  sensitive = true
  default   = "" # will be injected by terraform cloud config
}
