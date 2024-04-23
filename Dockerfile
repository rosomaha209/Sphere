# Використовуємо офіційний образ Python як базовий
FROM python:3.12

# Встановлюємо робочу директорію у контейнері
WORKDIR /app

# Встановлюємо залежності Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо весь проект у контейнер
COPY . /app/

# Вказуємо команду для запуску сервера
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
