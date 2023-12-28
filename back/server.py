from flask import Flask, request
from flask_cors import CORS
from flask_mysqldb import MySQL
from flask import jsonify
from datetime import datetime

import json
import bcrypt
import random
import string

app = Flask(__name__)
mysql = MySQL(app)
CORS(app)

# Config MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Matan2000'
app.config['MYSQL_DB'] = 'facebook_db'

# Generates random secret key
secretPassCode = bcrypt.gensalt(rounds=15)

# SQL handle
def handleUsers(query): 
    # Create Cursor
    cursor = mysql.connection.cursor()

    # Execute
    response = cursor.execute(query)

    # Commit to DB
    mysql.connection.commit()

    # Close connection
    cursor.close()

    return response

def handleOneResult(query):
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

def handleMultipleResults(query):
    # Create Cursor
    cursor = mysql.connection.cursor()

    # Execute
    cursor.execute(query)
    
    # Fetch data if the query returns any results
    data = cursor.fetchall()  # Use fetchall() for multiple rows

    # Commit to DB
    mysql.connection.commit()

    # Close connection
    cursor.close()

    return data  # Return the data fetched from the query

# Authentication
@app.route("/register", methods=['GET', 'POST'])
def register():
    data = request.data
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    firstname = json_str["Firstname"]
    lastname = json_str["Lastname"]
    email = json_str["Email"]
    birthday = json_str["Birthday"]
    password = json_str["Password"]
    sex = json_str["Sex"]
    firstlogin = 0

    # Hash Password

    password = password.encode() # Encode the password

    hashed_password = bcrypt.hashpw(password, secretPassCode) # Hash it using the secretPassCode

    # Check if mail exists
    query = '''SELECT email FROM register WHERE EXISTS (SELECT email FROM register WHERE email = '{}');'''.format(email)
    response = handleUsers(query)
  
    if(response == 0): # If doesn't exist create the new user
        query = '''INSERT INTO register(firstname, lastname, email, birthday, sex, password, firstlogin) VALUES ('{}','{}','{}','{}','{}','{}', '{}')'''.format(firstname, lastname, email, birthday, sex, hashed_password.decode('utf-'), firstlogin)
        
        response = handleUsers(query)
    
        return jsonify({'res': True})

    else: # Email exists, alert the user
        
        return jsonify({'res': False, 'err': 'Email Exists'})

@app.route("/login", methods=['GET', 'POST'])
def login():
    data = request.data
   
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str["Email"]
    password = json_str["Password"]

    # Get full data about the email including his hashed password (fetch)
    query = '''SELECT * FROM register WHERE email = '{}' '''.format(email) 
    response = handleOneResult(query)

    # If account exists
    if(response):
        # Save the password of the searched email
        usersHasedPassword = response[6].encode()

        # check if they are the same
        checker = bcrypt.checkpw(password.encode(), usersHasedPassword)

    else:
        checker = False

    # If hased password equals entered password
    if (checker):

        # Checks if this is the first login for the specific user 
        sql_query = '''SELECT * FROM register WHERE firstlogin = '{}' AND email = '{}' '''.format(1, email)
        response = handleUsers(sql_query)
        
        sessionID = genereteSessionID(16)


        # Second login
        if (response == 1):
           
            getUserNameQuery = f''' SELECT username FROM profiles WHERE email = '{email}'; '''
            username = handleOneResult(getUserNameQuery)[0]

            addSessionQuery = f'''INSERT INTO session(sessionID, email, username) VALUES ('{sessionID}','{email}','{username}')'''
            handleUsers(addSessionQuery)

            res = {
                'res' : True,
                'data' : {
                    'sessionID' :  sessionID,
                    'email' : email,
                    'username' : username
                },
                'firstlogin': False
            }

            return jsonify(res)
        else:
        
            addSessionQuery = f'''INSERT INTO session(sessionID, email) VALUES ('{sessionID}','{email}')'''
            handleUsers(addSessionQuery)
            
            # First login
            fLoginquery = f'''UPDATE register SET firstlogin = 1  WHERE email = '{email}' ''' # Updates that the specific user entered more then once
            handleUsers(fLoginquery)

            res = {
                    'res' : True,
                    'data' : {
                        'sessionID' :  sessionID,
                        'email' : email,
                    },
                    'firstlogin': True
                }

            return jsonify(res)
    else:
        return jsonify({'res': False, 'err': 'Email or Password are Incorrect'})

@app.route("/isAuthenticated", methods=['GET', 'POST'])
def isAuthenticated():
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["email"]
    sessionID = json_str["sessionID"]

        
    getEmailBySession = f''' SELECT email FROM session WHERE sessionID = '{sessionID}'; '''
    emailfromDB = handleOneResult(getEmailBySession)

    if(emailfromDB):
        if(email==emailfromDB[0]):
            return jsonify({'res': True})
        else:
            return jsonify({'res': False})
    else:
        return jsonify({'res': False})

@app.route("/handleSignOut", methods=['GET', 'POST'])
def handleSignOut():
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    sessionID = json_str['sessionID']
    print(sessionID, 'YES!')

    deletequery = f''' DELETE FROM session WHERE sessionID = '{sessionID}'; '''
    handleUsers(deletequery)

    return jsonify({'res': True})


# Profile
@app.route("/setprofile", methods=['GET', 'POST'])
def setprofile():
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    username = json_str['Username']
    email = json_str['Email']
    biography = json_str['Biography']
    relationshipstatus = json_str["RelationshipStatus"]
    occupation = json_str['Occupation']
    school = json_str['School']
    address = json_str['Address']
    
    # Checks if username exists
    if(username):
        query = f'''SELECT username FROM profiles WHERE EXISTS (SELECT username FROM profiles WHERE username = '{username}');'''
        response = handleUsers(query)
    else:
        response = 0
        
    print(response)

    if (response == 0): # If doesn't exist, continue

        # Initialize an empty list to store the update assignments
        update_assignments = []

        # Append assignments to the list only if the corresponding value is not empty
        if username:
            update_assignments.append(f"username = '{username}'")
        if biography:
            update_assignments.append(f"biography = '{biography}'")
        if relationshipstatus:
            update_assignments.append(f"relationshipstatus = '{relationshipstatus}'")
        if occupation:
            update_assignments.append(f"occupation = '{occupation}'")
        if school:
            update_assignments.append(f"school = '{school}'")
        if address:
            update_assignments.append(f"address = '{address}'")

        # Join the update assignments with commas to create the SET clause
        set_clause = ', '.join(update_assignments)

        # Build the SQL query
        query = f'''UPDATE profiles SET {set_clause} WHERE email = '{email}' '''
                
        # Send the query - can be update (for exsiting user) or set (for new user)
        response = handleUsers(query)

        addSessionQuery = f'''UPDATE session SET username = '{username}' WHERE email = '{email}' '''
        handleUsers(addSessionQuery)

        res = {
            'res' : True,
            'data' : {
                'username' : username
            }
        }

        return jsonify(res)

    else: # Username exists, alert the user    
        return jsonify({'res': False, 'err' : 'Username Exists'})

@app.route("/profile", methods=['GET', 'POST'])
def profile():
    data = request.data
   
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    query = '''SELECT * FROM profiles WHERE email = '{}' '''.format(email) 
    print(query)

    # Get full data about the email from db
    response = handleOneResult(query)
    
    # Set values
    res = {
        'res' : True,
        'data' : {
            'firstname': response[2], 
            'lastname': response[3],
            'birthday': response[5],
            'address': response[6],
            'school': response[7],
            'biography': response[8],
            'relationshipstatus': response[9],
            'username': response[10],
            'occupation': response[11]
        }
    }

    return jsonify(res)

@app.route("/uploadimage", methods=['GET', 'POST'])
def uploadimage(): # Sends uploaded profile image to db
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']
    uploadedimage = json_str['UploadedImage']
    print(uploadedimage)

    query = f'''UPDATE profiles SET userimages = '{uploadedimage}' WHERE email = '{email}' '''
    print(query)

    response = handleUsers(query)


    return jsonify({'res': True})

@app.route("/getProfileImage", methods=['GET', 'POST'])
def getProfileImage(): # Gets from db an uploaded profile image
    data = request.data
   
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    query = '''SELECT userimages FROM profiles WHERE email = '{}' '''.format(email) 
    print(query)
    
    # Get userimage where email from db
    response = handleOneResult(query)

    if(response):
        # Set values
        res = {
            'res' : True,
            'data' : {
                'userimage': response[0]
            }
        }
    else:
        # Set values
        res = {
            'res' : False,
        }

    print(res)

    return jsonify(res)

@app.route("/deleteProfileImage", methods=['GET', 'POST'])
def deleteProfileImage(): # Delete from db a profile image
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']

    query = f'''UPDATE profiles SET userimages = NULL WHERE email = '{email}' '''

    print(query)

    response = handleUsers(query)


    return jsonify({'res': True})

@app.route("/uploadPost", methods=['GET', 'POST'])
def uploadPost(): # Upload post/s to db
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']
    uploadedtext = json_str['UploadedText']
    uploadedimg = json_str['UploadedImg']
    uploadedprivacy = json_str['UploadedPrivacy']

    post = {
        'Text': uploadedtext,
        'Image': uploadedimg,
        'Privacy': uploadedprivacy,
        'date': str(datetime.now())
    }

    query = '''SELECT userposts FROM profiles WHERE email = '{}' '''.format(email) 
 
    # Get userposts where email from db
    posts = handleOneResult(query)

    posts = posts[0]

    if (posts == None): # If userposts has no image in it

        # post['id'] = 1 # check if work later!

        query = f'''UPDATE profiles
            SET userposts = JSON_ARRAY(
                '{json.dumps(post)}'
            )
            WHERE email = '{email}';
        '''

        handleUsers(query)      
    else: # If userposts contains posts

        posts = json.loads(posts)

        # Convert posts to array
        allposts = posts

        # Push new post
        allposts.append(json.dumps(post))

        # Convert the array back to fit the sql query
        allposts_str = ',\n'.join(f"'{postFromAllPosts}'" for postFromAllPosts in allposts)
        
        query = f'''UPDATE profiles
            SET userposts = JSON_ARRAY(
                {allposts_str}
            )
            WHERE email = '{email}';
        '''

        handleUsers(query)
      

    return jsonify({'res': True})

@app.route("/getProfilePost", methods=['GET', 'POST'])
def getProfilePost(): # Get post/s from db
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    query = '''SELECT userposts FROM profiles WHERE email = '{}' '''.format(email) 
    print(query)
    
    # Get userimage where email from db
    response = handleOneResult(query)
    response = response[0]

    if (response):
        posts = json.loads(response)

        allposts = []

        for post in posts:
            allposts.append(json.loads(post))

    if(response != None):

        res = {
            'data' : allposts,
            'res': True
        }    

        print(allposts, 'here')

        return jsonify(res)
    
    return jsonify({'res': False, 'data' : []})


@app.route("/acceptFriend", methods=['GET','POST'])
def acceptFriend(): # Friend acception => both added in db to each other
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str["Email"]
    friend_email = json_str["FriendEmail"]
    index = json_str['Index'] # for delete notification


    ######### user who requested friend gets friend #########
    query = '''SELECT friends FROM handlefriends WHERE user_email = '{}' '''.format(email) 
 
    # Get friends where email from db
    friends = handleOneResult(query)

    friends = friends[0]

    if (friends == None): # If email-db-friends has nothing

        query = f'''UPDATE handlefriends
            SET friends = JSON_ARRAY(
                '{json.dumps(friend_email)}'
            )
            WHERE user_email = '{email}';
        '''

        handleUsers(query)      

    else: # If email-db-friends contains friends

        friends = json.loads(friends)

        # Convert friends to array
        allfriends = friends

        # Push new friend
        allfriends.append(json.dumps(friend_email))

        # Convert the array back to fit the sql query
        allfriends_str = ',\n'.join(f"'{friendsFromAllfriends}'" for friendsFromAllfriends in allfriends)
        
        query = f'''UPDATE handlefriends
            SET friends = JSON_ARRAY(
                {allfriends_str}
            )
            WHERE user_email = '{email}';
        '''

        handleUsers(query)

    ######### user who sent friend request gets friend #########
    query = '''SELECT friends FROM handlefriends WHERE user_email = '{}' '''.format(friend_email) 
 
    # Get friends where email from db
    friendsTwos = handleOneResult(query)

    friendsTwos = friendsTwos[0]

    if (friendsTwos == None): # If email-db-friends has nothing

        query = f'''UPDATE handlefriends
            SET friends = JSON_ARRAY(
                '{json.dumps(email)}'
            )
            WHERE user_email = '{friend_email}';
        '''

        handleUsers(query)      

    else: # If email-db-friends contains friends

        friendsTwos = json.loads(friendsTwos)

        # Convert friends to array
        allfriendsTwos = friendsTwos

        # Push new friend
        allfriendsTwos.append(json.dumps(email))

        # Convert the array back to fit the sql query
        allfriendsTwos_str = ',\n'.join(f"'{friendsTwosFromAllfriendsTwos}'" for friendsTwosFromAllfriendsTwos in allfriendsTwos)
        
        query = f'''UPDATE handlefriends
            SET friends = JSON_ARRAY(
                {allfriendsTwos_str}
            )
            WHERE user_email = '{friend_email}';
        '''

        handleUsers(query)

    delete_notification_query = f"""
        UPDATE profiles
        SET notifications = CASE
            WHEN JSON_LENGTH(notifications) > 1 THEN JSON_REMOVE(notifications, '$[{index}]')
            ELSE NULL
        END
        WHERE email = '{email}';
    """

    response = handleUsers(delete_notification_query)


    return jsonify({'res': True})

@app.route("/ignoreFriend", methods=['GET','POST'])
def ignoreFriend(): # Friend ignore => notification gets delete for the user
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str["Email"]
    index = json_str["Index"]

    delete_notification_query = f"""
        UPDATE profiles
        SET notifications = CASE
            WHEN JSON_LENGTH(notifications) > 1 THEN JSON_REMOVE(notifications, '$[{index}]')
            ELSE NULL
        END
        WHERE email = '{email}';
    """

    response = handleUsers(delete_notification_query)

    return jsonify({'res': True})
    
@app.route("/startFriendRequest", methods=['GET','POST'])
def startFriendRequest(): # Starts friend request => info to column notifcations
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str["Email"]
    friend_email = json_str["FriendEmail"]


    query = f'''SELECT username, userimages FROM profiles WHERE email = '{email}' '''
    response = handleMultipleResults(query)

    username = response[0][0]
    user_image = response[0][1]

    notification = {
        'Email': email,
        'Username': username,
        'UserImage': user_image,
    }

    check_query = f'''SELECT notifications FROM profiles WHERE email = '{friend_email}' '''
 
    # Get notifications where email from db
    notifications = handleOneResult(check_query)

    notifications = notifications[0]

    if (notifications == None): # If db-notifications has no notification in it

        insert_to_notification_query = f'''UPDATE profiles
            SET notifications = JSON_ARRAY(
                '{json.dumps(notification)}'
            )
            WHERE email = '{friend_email}';
        '''

        handleUsers(insert_to_notification_query)      
    else: # If db-notifications contains notifications

        notifications = json.loads(notifications)

        # Convert notifications to array
        allnotifications = notifications

        # Push new notification
        allnotifications.append(json.dumps(notification))

        # Convert the array back to fit the sql query
        allnotifications_str = ',\n'.join(f"'{notificationFromAllnotifications}'" for notificationFromAllnotifications in allnotifications)
        
        insert_query = f'''UPDATE profiles
            SET notifications = JSON_ARRAY(
                {allnotifications_str}
            )
            WHERE email = '{friend_email}';
        '''

        handleUsers(insert_query)

    return jsonify({'res': True})

@app.route("/newNotifications", methods=['GET','POST'])
def newNotifications(): # Checks if user got any notifications => Gets the data of a notification
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str["Email"]

    query = f'''SELECT notifications FROM profiles WHERE email = '{email}' '''
 
    # Get notifications where email from db
    response = handleOneResult(query)
    response = response[0]

    if (response):
        notifications = json.loads(response)

        allnotifications = []

        for notification in notifications:
            allnotifications.append(json.loads(notification))

    if(response != None):

        res = {
            'data' : allnotifications,
            'res': True
        }    

        return jsonify(res)
    
    return jsonify({'res': False, 'data' : []})

@app.route("/checkFriend", methods=['GET','POST'])
def checkFriend(): # Checks if user got any friends
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str["UserEmail"]
    friend_email_to_check  = json_str["Email"]

    query = '''SELECT friends FROM handlefriends WHERE user_email = '{}' '''.format(email) 
    friends = handleOneResult(query)

    friends = friends[0]

    if friends:
        friends_list = json.loads(friends)

        # Check if the friend_email_to_check is in the list with quotes
        if f'"{friend_email_to_check}"' in friends_list:
            print('Success! Friend found')

        else:
            print('Friend not found in the list.')
            
            return jsonify({'res': False, 'Note': 'Users Arent Friends'})

    else:
        friends_length = 0
        return jsonify({'res': False, 'Note': 'No Friends For The User'})


    return jsonify({'res': True})

@app.route("/hasFriendsAtAll", methods=['GET','POST'])
def hasFriendsAtAll(): # Displays the number of friends user have
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # get the all friends of the user and send to front

    # Set values
    email = json_str.get("Email")
    friend_email_to_check = json_str.get("FriendsEmail")
    program = json_str["Program"]

    if friend_email_to_check is not None:
        query = '''SELECT friends FROM handlefriends WHERE user_email = '{}' '''.format(friend_email_to_check)
    else:
        query = '''SELECT friends FROM handlefriends WHERE user_email = '{}' '''.format(email)

    # Displaying for profile number of friends
    if (program=='0'):

        friends = handleOneResult(query)

        friends = friends[0]

        friends_length = 0 

        if friends:
            friends_list = json.loads(friends)
            friends_length = len(friends_list)
            return jsonify({'res': True, 'friendsLengthNumber': friends_length})

        else:
            friends_length = 0
            return jsonify({'res': True, 'friendsLengthNumber': friends_length, 'Note': 'No Friends For The User'})



    # Displaying for profile(displayfriends) friends data
    else:
        
        friends = handleOneResult(query)
        friends = friends[0]

        allFetchedUsers = []

        
        if friends:
            friends_list = json.loads(friends)

            # Takes every email from friends_list and gets from db username and userimages to the speceific email.
            for emailAddress in friends_list:
                clean_email_address = emailAddress.strip('"') # from "example@gmail.com" => example@gmail.com
                fetch_data_query = f"SELECT username, userimages FROM profiles WHERE email = '{clean_email_address}' " 
                fetched_users = handleMultipleResults(fetch_data_query)

                username = fetched_users[0][0]
                user_image = fetched_users[0][1]
                
                # Structure 
                allFetched = {
                    'email': clean_email_address,
                    'username': username,
                    'userimages': user_image
                } 

                allFetchedUsers.append(allFetched)

            return jsonify({'res': True, 'friendsData' : allFetchedUsers})

    return jsonify({'res': False, 'data' : 'no friends for the user'})

@app.route("/deleteFriendRequest", methods=['GET','POST'])
def deleteFriendRequest(): # Deletes friendship of each other
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str["Email"]
    friend_email = json_str["FriendEmail"]

    delete_query = f"UPDATE handlefriends SET friends = JSON_REMOVE(friends, '$[{friend_email}]') WHERE user_email = '{email}'"
    delete_queryTwo = f"UPDATE handlefriends SET friends = JSON_REMOVE(friends, '$[{friend_email}]') WHERE user_email = '{email}'"

    print(delete_query, 'first')
    print(delete_queryTwo, 'two')


    # responseOne = handleUsers(delete_query)
    # responseTwo = handleUsers(delete_queryTwo)

    print(responseOne, 'one')
    print(responseTwo, 'two')



    return jsonify({'res': True})

@app.route("/isFriendPending", methods=['GET', 'POST'])
def isFriendPending():
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']
    friendEmail = json_str['friendEmail']
    

    friendsNotifications = f"SELECT notifications FROM profiles WHERE email = '{friendEmail}';"
    response = handleOneResult(friendsNotifications)
  
    friends = response[0]
    friends = json.loads(friends)
    boole = False 

    for friend in friends:
        friend = json.loads(friend)

        if friend['Email']==email:
            boole = True

    if boole:
        return jsonify({'res': True, 'pending' : True})
    else:
        return jsonify({'res': True, 'pending' : False})
    
@app.route("/oneFriendRequestCheck", methods=['GET', 'POST'])
def oneFriendRequestCheck():
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str["UserEmail"]
    friend_email_to_check  = json_str["Email"]

    query = '''SELECT notifications FROM profiles WHERE email = '{}' '''.format(email) 
    response = handleOneResult(query)

    if friend_email_to_check in response[0]:
        print('user is waiting for friend approval')

        return jsonify({'res': True, 'Note': 'user is waiting for friend approval'})

    else:
        print('theres no request waiting')

    return jsonify({'res': False})



# Marketplace
@app.route("/uploadProduct", methods=['GET', 'POST'])
def uploadProduct(): # Upload product/s to db
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']
    uploadedcategory = json_str['UploadedCategory']
    uploadedtext = json_str['UploadedText']
    uploadedimg = json_str['UploadedImg']
    uploadedprice = json_str['UploadedPrice']
    uploadedcity = json_str['UploadedCity']


    product = {
        'Category': uploadedcategory,
        'Text': uploadedtext,
        'Image': uploadedimg,
        'Price': uploadedprice,
        'City': uploadedcity,
        'date': str(datetime.now())
    }

    query = '''SELECT products FROM marketplace WHERE user_email = '{}' '''.format(email) 
 
    # Get products where email from db
    products = handleOneResult(query)

    products = products[0]

    if (products == None): # If db-products has no image in it

        # post['id'] = 1 # check if work later!

        query = f'''UPDATE marketplace
            SET products = JSON_ARRAY(
                '{json.dumps(product)}'
            )
            WHERE user_email = '{email}';
        '''

        handleUsers(query)      
    else: # If db-products contains products

        products = json.loads(products)

        # Convert products to array
        allproducts = products

        # Push new product
        allproducts.append(json.dumps(product))

        # Convert the array back to fit the sql query
        allproducts_str = ',\n'.join(f"'{productFromAllproducts}'" for productFromAllproducts in allproducts)
        
        query = f'''UPDATE marketplace
            SET products = JSON_ARRAY(
                {allproducts_str}
            )
            WHERE user_email = '{email}';
        '''

        handleUsers(query)
      

    return jsonify({'res': True})

@app.route("/editProduct", methods=['GET', 'POST'])
def editProduct():
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']
    index = json_str['Index']
    uploadedcategory = json_str['UploadedCategory']
    uploadedtext = json_str['UploadedText']
    uploadedimg = json_str['UploadedImg']
    uploadedprice = json_str['UploadedPrice']
    uploadedcity = json_str['UploadedCity']


    product = {
        'Category': uploadedcategory,
        'Text': uploadedtext,
        'Image': uploadedimg,
        'Price': uploadedprice,
        'City': uploadedcity,
        'date': str(datetime.now())
    }

    # Convert Python dictionary to a JSON string
    product_json = json.dumps(product)

    # Adjusted SQL query with variables directly in the string
    edit_query = f"""
        UPDATE marketplace
        SET products = JSON_REPLACE(
            products,
            CONCAT('$[{index}]'),
            CAST('{product_json}' AS CHAR CHARACTER SET utf8mb4)
        )
        WHERE user_email = '{email}'
    """
    print(edit_query)
    
    response = handleUsers(edit_query)


    return jsonify({'res': True})

@app.route("/getSpecificProduct", methods=['GET', 'POST'])
def getSpecificProduct(): # Get product/s from db to a specific user
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    query = '''SELECT products FROM marketplace WHERE user_email = '{}' '''.format(email) 
    print(query)
    
    # Get product where email from db
    response = handleOneResult(query)
    response = response[0]

    if (response):
        products = json.loads(response)
        print(products)

        allproducts = []

        for product in products:
            allproducts.append(json.loads(product))

    if(response != None):

        res = {
            'data' : allproducts,
            'res': True
        }    

        return jsonify(res)
    
    return jsonify({'res': False, 'data' : []})

@app.route("/getAllProduct", methods=['GET', 'POST'])
def getAllProduct(): # Get product/s from db for everyone
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    query = '''SELECT products FROM marketplace'''
    print(query)
    response = handleMultipleResults(query)

    allproducts = []

    if response:
        for product_tuple in response:
            if product_tuple and product_tuple[0] and product_tuple[0] != 'None':
                product_json_str = product_tuple[0]
                try:
                    # Attempt to load as a JSON object
                    product_dict = json.loads(product_json_str)
                    allproducts.append(product_dict)
                except json.JSONDecodeError:
                    # If it's not a JSON object, assume it's a list and extend allproducts
                    allproducts.extend(json.loads(product_json_str))

    if(response != None):

        res = {
            'data' : allproducts,
            'res': True
        }    

        return jsonify(res)
    
    return jsonify({'res': False, 'data' : []})

@app.route("/deleteProductRequest", methods=['GET', 'POST'])
def deleteProductRequest():
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']
    index = json_str['Index']

    deleteQuery = f"UPDATE marketplace SET products = JSON_REMOVE(products, '$[{index}]') WHERE user_email = '{email}'"

    response = handleUsers(deleteQuery)


    return jsonify({'res': True})

# Feed
@app.route("/getPostsToFeed", methods=['GET', 'POST'])
def getPostsToFeed(): # Get post/s from db
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    query = f"SELECT userposts FROM profiles WHERE email <> '{email}';"
    print(query)
    
    # Get userposts except specific email from db
    response = handleMultipleResults(query)

    
    allPosts = []

    if response:
        # Going through every userPosts and checks if he has any
        for userPosts in response:
            # If user has posts => add his posts to allPosts array
            if userPosts[0]!=None:
                posts = json.loads(userPosts[0])
                allPosts.append(posts)

    if(response != None):

        # Merging 3 arrays into one. array = [[array], [array], [array]]
        one_array_allPosts = []

        for array in allPosts:
            one_array_allPosts.extend(array)

        # Transfers allPosts to become readable (removing python)
        transformed_data = []

        for item in one_array_allPosts:
            json_item = json.loads(item)
            transformed_data.append(json_item)

        res = {
            'data' : transformed_data,
            'res': True
        }  

        print(one_array_allPosts, 'here')

        return jsonify(res)

    return jsonify({'res': False, 'data' : []})



# Search
@app.route("/search", methods=['GET', 'POST'])
def search():
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    searchPhrase = json_str['searchPhrase']

    search_query =  f'''SELECT email, username, userimages FROM profiles WHERE username LIKE '%{searchPhrase}%' '''
    
    data = handleMultipleResults(search_query)
    print(data)

    # Set values
    jsonedData = []

    for row in data:
        jsonedRow = {
            'email' : row[0],
            'username' : row[1],
            'userimages' : row[2]
        }

        jsonedData.append(jsonedRow)

    res = {
            'data' : jsonedData,
            'res': True
        }    

    return jsonify(res)




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
# 1. Marketplace ------------------------------------------------------ In Progress...
# 2. Friends ---------------------------------------------------------- VVVVVVVVVVVVVV
# 3. Feed -------------------------------------------------------------

# Can't Tell Tasks:
# 1. Every new post uploaded by user will appear up so thats the first post in the column
# 2. make a skeleton while loading profile data

# Easy Tasks:
# 1. for search - move between option using buttons 

# Video tasks:
# 1. learn react classes in udemy.
# 2. 

# Problems
# 1. in productUpload, enter key opens file    !!!
# 2. db json columns cant get hebrew words     !!!
# 


# Marketplace Related Tasks:
# 1. figure out a way to chunk 6 products in one chunk => make a map ----- VVV
# 2. format date problem ------------------------------------------------- VVV
# 3. figure out a way to import every product to a single page ----------- VVV
# 4. cities api ----------------------------------------------------------



# Friends Related Tasks:
# 1. Display number of friends ----------------------------------------------------- VVV
# 2. When clicking on number of friends, list of all friends will appear ----------- VVV
# 3. Option to delete a friend ----------------------------------------------------- XXV
# 4. When add friend, user will get notification i wants to accept or no ----------- VVV
# (red alert of notification => problem, when accepting friend it disapperes and when refersgin it gets back)
# (friend pending goes back to initial state when page refreshes) => check if db got any notification, if so, return 'pending', else, return 'add friend'.

# 5. feature to exit window of notification with mouse --------------------------=--- VVV