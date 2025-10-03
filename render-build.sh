#!/bin/bash

echo "Starting Render deployment build..."

# Install Maven if not present
if ! command -v mvn &> /dev/null; then
    echo "Installing Maven..."
    wget https://archive.apache.org/dist/maven/maven-3/3.9.5/binaries/apache-maven-3.9.5-bin.tar.gz
    tar -xzf apache-maven-3.9.5-bin.tar.gz
    export PATH=$PWD/apache-maven-3.9.5/bin:$PATH
fi

# Build the application
echo "Building Spring Boot application..."
cd backend
./mvnw clean package -DskipTests

echo "Build completed successfully!"