#!/bin/bash


run() {
    gnome-terminal -- bash -c "cd djangoproj; source venv/bin/activate; python manage.py runserver; exec bash"

    gnome-terminal -- bash -c "cd reactapp; npm run start; exec bash"

    gnome-terminal -- bash -c "docker ps -a | grep -q my-redis-container && sudo docker start my-redis-container || sudo docker run --name my-redis-container -d -p 6379:6379 redis; exec bash"
}

run