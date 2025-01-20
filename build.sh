#!/bin/bash

# Navigate to the backend directory and install dependencies
cd chatbot-backend
npm install
npm run build

# Navigate to the frontend directory and install dependencies
cd ../chatbot-frontend
npm install
npm run build
