# TSG Noticeboard

**_Under Construction 🏗️_**

## setting up environment variables

The project needs the .env file with dedicated information to function properly.
make the .env file from the **example.env** provided and provide the necessary information (DON'T change the variables' names);

## local deployment

run `docker compose up -d --build` in the cloned repo directory and it'd work well.

Backend can be accessed on port 5000 and frontend at 3000. (if backend port is unavailable check docker-compose.yaml and ./backend/Dockerfile for a new port setup.)

## Checklist before deployment

- Note that .env has proper credentials
- admins are added properly in a separate object
- backend port is not exposed anymore
