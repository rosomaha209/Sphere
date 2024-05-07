web: gunicorn Sphere.wsgi --log-file -
release: cd messaging-ui && npm install && npm run build && cd .. && python manage.py collectstatic --noinput
