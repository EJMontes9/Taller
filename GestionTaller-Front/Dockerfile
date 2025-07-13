# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/dome28062025/browser /usr/share/nginx/html
# Create a clean nginx.conf file without BOM
RUN printf 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    # Cache static assets\n\
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, max-age=31536000";\n\
    }\n\
\n\
    # Don'\''t cache HTML files\n\
    location ~* \\.html$ {\n\
        expires -1;\n\
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
