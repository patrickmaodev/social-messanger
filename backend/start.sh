#!/bin/bash

# Wait for database to be ready
echo "Waiting for database..."
while ! nc -z db 5434; do
  sleep 1
done
echo "Database is ready!"

# Run migrations
echo "Running migrations..."
python social_messenger/manage.py migrate

# Create superuser if it doesn't exist
echo "Creating superuser..."
python social_messenger/manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@example.com').exists():
    User.objects.create_superuser(
        email='admin@example.com',
        full_name='Admin',
        password='admin123'
    )
    print('Superuser created')
else:
    print('Superuser already exists')
EOF

# Start the server
echo "Starting Django server..."
python social_messenger/manage.py runserver 0.0.0.0:8000
