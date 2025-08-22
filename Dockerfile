FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --omit=dev

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 4003

# Commande de démarrage
CMD ["npm", "start"]
