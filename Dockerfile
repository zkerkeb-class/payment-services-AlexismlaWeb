FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Exposer le port
EXPOSE 4003

# Commande de démarrage
CMD ["npm", "start"]
