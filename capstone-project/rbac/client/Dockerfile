# ---------- Frontend Dockerfile ----------
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files and build the React app
COPY . .
RUN npm run build

# ---------- Serve with nginx ----------
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
