#!/bin/bash

# Create directories
mkdir -p src/main/resources/keys

# Generate private key
openssl genrsa -out src/main/resources/keys/privateKey.pem 2048

# Generate public key
openssl rsa -in src/main/resources/keys/privateKey.pem -pubout -out src/main/resources/keys/publicKey.pem

# Set permissions for the keys
chmod 644 src/main/resources/keys/privateKey.pem
chmod 644 src/main/resources/keys/publicKey.pem

echo "JWT keys generated successfully."
