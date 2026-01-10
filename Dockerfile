# ИСПОЛЬЗУЕМ ВЕРСИЮ 20 (Стабильная и проверенная для Astro)
# Вместо lts-alpine, который может скачать 22 или 24
FROM node:20-alpine

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости с флагом для решения конфликтов версий
RUN npm install --legacy-peer-deps

# Копируем остальной код
COPY . .

# Собираем проект
RUN npm run build

# Настраиваем переменные для запуска
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# Запускаем сервер
CMD ["node", "./dist/server/entry.mjs"]
