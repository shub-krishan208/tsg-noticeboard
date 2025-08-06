# TSG Noticeboard

**_Under Construction 🏗️_**

## setting up environment variables

The project needs the .env file with dedicated information to function properly.
make the .env file from the **example.env** provided and provide the necessary information (DON'T change the variables' names);

## local deployment

run `docker compose up -d --build` in the cloned repo directory and it'd work well.

Backend can be accessed on port 5000 and frontend at 3000. (if backend port is unavailable check docker-compose.yaml and ./backend/Dockerfile for a new port setup.)

### fetch calls on browser console

For the admin priviledges commands, use the following command:

```js
// first get an auth token
fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
            'Content-Type': 'application/json',
        },
    body: JSON.stringify({
            username: 'yourname',
            password: 'yourpassword',
        }).
    })
    .then((res) => {
          if (!res.ok) {
            return res.json().then((err) => {
              throw new Error(err.message || "Failed to log in");
            });
          }
          return res.json();
        })
        .then((data) => {
          const token = data.token;
          console.log("Login successful!");
        });

// then make the api call for functions: CreateNotice, DeleteNotice, ArchiveNotice

// CreateNotice

```

## Checklist before deployment

- Note that .env has proper credentials
- admins are added properly in a separate object
- backend port is not exposed anymore
