# Stage 1: Build the Angular app
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the app using Node.js and the serve package
FROM node:14
WORKDIR /app
COPY --from=build /app/dist/credit-score-analysis .
RUN npm install -g serve
EXPOSE 8080
CMD ["serve", "-s", ".", "-l", "8080"]
