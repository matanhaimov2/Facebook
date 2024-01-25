from flask import Flask, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from flask_socketio import SocketIO, join_room, leave_room, send

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

# Socket config
socketIo = SocketIO(app, cors_allowed_origins="*") 

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



# Chat Config
@socketIo.on('join')
def handle_connect(payload):

    room_name = payload["roomName"]   

    room = f'usertypechat_{room_name}'
    print("room: ",room)

    # Create room
    join_room(room)


@socketIo.on('message')
def handle_message(payload):

    sender = payload["sender"]
    message = payload["message"]
    to_user = payload["to"]
    room_name = payload["roomName"]


    room = f'usertypechat_{room_name}'

    message_data = {
        "sender": sender,
        "message": message,
        "to": to_user
    }
    

    print("message_data: ",message_data)
    print("to: ",room)

    send(message_data, to=room)
    # socketIo.emit('message', message_data, room=room)    # MATAN dont delete this keep it until we will finish completly

    return None
 



# Sub Functions
def genereteSessionID(length):

    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str


if __name__ == "__main__":
    socketIo.run(app, debug=True)

# Guider :
    # Main Tasks:
    # 1. Marketplace --------------------------------------------------------------- In Progress...
    # 2. Friends ------------------------------------------------------------------- VVVVVVVVVVVVVV
    # 3. Feed ---------------------------------------------------------------------- In Progress...
    # 4. OnlineFriends ------------------------------------------------------------- VVVVVVVVVVVVVV


    # Marketplace Related Tasks:
    # 1. figure out a way to chunk 6 products in one chunk => make a map ----------- VVV
    # 2. format date problem ------------------------------------------------------- VVV
    # 3. figure out a way to import every product to a single page ----------------- VVV
    # 4. cities api ----------------------------------------------------------------
    # 5. buying option - starting chat with product creator ------------------------ wating for chat...


    # Friends Related Tasks:
    # 1. Display number of friends ------------------------------------------------- VVV
    # 2. When clicking on number of friends, list of all friends will appear ------- VVV
    # 3. Option to delete a friend ------------------------------------------------- VVV
    # 4. When add friend, user will get notification i wants to accept or no ------- VVV
    # 5. feature to exit window of notification with mouse ------------------------- VVV
    # ==> Friends Page:
    # 6. section of user's friends ------------------------------------------------- VVV
    # 7. section of suggestions for new friends ------------------------------------ VVV


    # Feed Related Tasks:
    # 1. Fetch allposts from db to feed -------------------------------------------- VVV
    # 2. Sort posts by time -------------------------------------------------------- VVV
    # 3. Fetch also username and userimages ---------------------------------------- VVV
    # 4. Reload 5 posts. when user is scrolling reload another 5 ------------------- Problem - ask shlomi!
    # 5. Get posts according to privacy settings ----------------------------------- VVV

    # Notifications
    # 1. notifications for friend request and approval ----------------------------- VVV
    # 2. notificaions for likes added to user's post ------------------------------- Wating........
    # 3. notifications for comments added to user's post --------------------------- Wating........


    # Chats
    # 1. design the all thing ------------------------------------------------------ VVV
    # 2. option to visit user profile - feature ------------------------------------
    # 3.

    # **********************************************************************************************************************************
    # **********************************************************************************************************************************

    # Complex Tasks :
    # 1. Add light mode option to the entire website ------------------------------- Wating........
    # 2. Add an option to switch between languages (eng, heb) ---------------------- Wating........


    # Can't Tell Tasks:
    # 1. make session id last for 5 minutes of inactivity. ------------------------- Problem - ask shlomi!
    # 2. make a skeleton while loading profile data -------------------------------- Wating........
    # 3. add the number of notifications in the circle ----------------------------- wating........


    # Easy Tasks:
    # 1. for search - move between option using buttons ---------------------------- Wating........


    # Problems
    # 1. in productUpload, enter key, opens file ----------------------------------- !!!
    # 2. db json columns cant get hebrew words ------------------------------------- !!!
    # 3. can't press notification to close it -------------------------------------- !!!
    # 4. when loading facebook on home route, errors raises up --------------------- !!!
    # 5. make session id last for 5 minutes of inactivity. ------------------------- problem - ask shlomi!


    # Video tasks:
    # 1. learn react classes in udemy.
    # 2. 
