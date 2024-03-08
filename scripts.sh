#!/bin/bash


run() {
    #gnome-terminal -- bash -c "cd djangoproj; source venv/bin/activate; python manage.py runserver; exec bash"

    #gnome-terminal -- bash -c "cd reactapp; npm run start; exec bash"

    #gnome-terminal -- bash -c "docker ps -a | grep -q my-redis-container && sudo docker start my-redis-container || sudo docker run --name my-redis-container -d -p 6379:6379 redis; exec bash"

    
    gnome-terminal -- bash -c "sudo docker compose up --build; exec bash"

    gnome-terminal --bash -c "cd reactapp; REACT_APP_API_KEY=http://127.0.0.1:8000/api REACT_APP_WS_URL=ws://127.0.0.1:8000/ws yarn build; cd dist; python3 -m http.webserver 3000; exec bash"
    
    
}

run