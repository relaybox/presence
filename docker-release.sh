# Get version from package.json
VERSION=$(cat package.json | grep '"version":' | awk -F'"' '{print $4}')

# Tag the image with both 'latest' and the specific version number
docker build -t relaybox/presence:latest -t relaybox/presence:$VERSION .

# Push both the 'latest' and versioned tags to Docker Hub
docker push relaybox/presence:latest
docker push relaybox/presence:$VERSION
