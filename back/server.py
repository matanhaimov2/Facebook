from flask import Flask, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL

# Other imports
import random, string


# Blue Prints
from routes.marketplace import marketplace_bp
from routes.authontication import authontication_bp
from routes.profiles import profiles_bp
from routes.friends import friends_bp
from routes.search import search_bp
from routes.notifications import notifications_bp


app = Flask(__name__)
mysql = MySQL(app)
CORS(app)


# Register the Blueprints
app.register_blueprint(marketplace_bp)
app.register_blueprint(authontication_bp)
app.register_blueprint(profiles_bp)
app.register_blueprint(friends_bp)
app.register_blueprint(search_bp)
app.register_blueprint(notifications_bp)

# Config MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Matan2000'
app.config['MYSQL_DB'] = 'facebook_db'

# SQL handle
def handleUsers(query): # Make actions in db 
    # Create Cursor
    cursor = mysql.connection.cursor()

    # Execute
    response = cursor.execute(query)

    # Commit to DB
    mysql.connection.commit()

    # Close connection
    cursor.close()

    return response

def handleOneResult(query): # Make actions and fetch one column
    # Create Cursor
    cursor = mysql.connection.cursor()

    # Execute
    cursor.execute(query)
    
    # Fetch data if the query returns any results
    data = cursor.fetchone()  # Use fetchall() for multiple rows

    # Commit to DB
    mysql.connection.commit()

    # Close connection
    cursor.close()

    return data  # Return the data fetched from the query

def handleMultipleResults(query): # # Make actions and fetch multiple columns
    # Create Cursor
    cursor = mysql.connection.cursor()

    # Execute
    cursor.execute(query)
    
    # Fetch data if the query returns any results
    data = cursor.fetchall()

    # Commit to DB
    mysql.connection.commit()

    # Close connection
    cursor.close()

    return data  # Return the data fetched from the query


# HealthCheck
@app.route("/healthCheck", methods=['GET', 'POST'])
def healthCheck():
    return jsonify({'res': True})



# Sub Functions
def genereteSessionID(length):

    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str


if __name__ == "__main__":
    app.run(debug = True)



# Complex Tasks:
# 1. Marketplace ----------------------------------------------------------- In Progress...
# 2. Friends --------------------------------------------------------------- VVVVVVVVVVVVVV
# 3. Feed ------------------------------------------------------------------ In Progress...
# 4. OnlineFriends --------------------------------------------------------- VVVVVVVVVVVVVV
# 5. Add light mode option to the entire website --------------------------- Wating........
# 6. Add an option to switch between languages (eng, heb) ------------------ Wating........

# Can't Tell Tasks:
# 1. make session id last for 5 minutes of inactivity. --------------------- Problem - ask shlomi!
# 2. make a skeleton while loading profile data
# 3. add the number of notifications in the circle ------------------------- wating........


# Easy Tasks:
# 1. for search - move between option using buttons 
# 2. change dot of new notificaton


# Video tasks:
# 1. learn react classes in udemy.
# 2. 


# Problems
# 1. in productUpload, enter key opens file                !!!
# 2. db json columns cant get hebrew words                 !!!
# 3. can't press notification to close it                  !!!
# 4. when loading facebook on home route, errors raises up !!!


# Marketplace Related Tasks:
# 1. figure out a way to chunk 6 products in one chunk => make a map ---------- VVV
# 2. format date problem ------------------------------------------------------ VVV
# 3. figure out a way to import every product to a single page ---------------- VVV
# 4. cities api ---------------------------------------------------------------


# Friends Related Tasks:
# 1. Display number of friends ------------------------------------------------- VVV
# 2. When clicking on number of friends, list of all friends will appear ------- VVV
# 3. Option to delete a friend ------------------------------------------------- VVV
# 4. When add friend, user will get notification i wants to accept or no ------- VVV
# (red alert of notification => problem, when accepting friend it disapperes and when refersgin it gets back)
# (friend pending goes back to initial state when page refreshes) => check if db got any notification, if so, return 'pending', else, return 'add friend'.
# 5. feature to exit window of notification with mouse ------------------------- VVV


# Feed Related Tasks:
# 1. Fetch allposts from db to feed -------------------------------------------- VVV
# 2. Sort posts by time -------------------------------------------------------- VVV
# 3. Fetch also username and userimages ---------------------------------------- VVV
# 4. Reload 5 posts. when user is scrolling reload another 5 ------------------- Problem - ask shlomi!
# 5. Get posts according to privacy settings -----------------------------------