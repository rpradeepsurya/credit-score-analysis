#!/bin/bash

# Navigate to the server directory, install dependencies and run the Flask app
cd server
pip install -r requirements.txt
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --port=5000 &
echo "Flask server is running on http://localhost:5000"

# Wait for 3 seconds to allow Flask to start
sleep 3

# Navigate to the client directory, install dependencies and run the Angular app
cd ../webUI
npm install
ng serve &
echo "Angular app is running on http://localhost:4200"

# Wait for both processes to finish
wait
