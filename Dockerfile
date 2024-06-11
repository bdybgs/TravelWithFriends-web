# Используем базовый образ с Node.js
FROM node:14

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в рабочую директорию
COPY package*.json ./

# Устанавливаем зависимости с флагом --legacy-peer-deps для игнорирования конфликтов зависимостей
RUN npm install --legacy-peer-deps

# Устанавливаем HTTP-сервер для обслуживания статических файлов
RUN npm install -g serve

# Копируем все файлы проекта в контейнер
COPY . .

# Собираем проект
RUN npm run build

# Запускаем приложение при старте контейнера
CMD ["serve", "-s", "build", "-l", "3000"]
