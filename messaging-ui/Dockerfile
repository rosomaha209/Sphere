
FROM node:14


WORKDIR /app


COPY package.json package-lock.json ./
# Копіювання файлу package.json і package-lock.json (якщо він існує)
COPY messaging-ui/package*.json ./

RUN npm install

COPY . ./
COPY messaging-ui/ .



RUN npm run build


FROM nginx:alpine


COPY --from=0 /app/build /usr/share/nginx/html


EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]
