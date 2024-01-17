from flask import Blueprint, request, jsonify

# Other imports
import json, bcrypt


# Blue Print Set
authontication_bp = Blueprint('authontication', __name__)

# Generates random secret key
secretPassCode = bcrypt.gensalt(rounds=15)


# Route & Functions

@authontication_bp.route("/register", methods=['GET', 'POST'])
def register():
    from server import handleUsers
    
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

@authontication_bp.route("/login", methods=['GET', 'POST'])
def login():
    from server import handleUsers, handleOneResult, genereteSessionID

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

@authontication_bp.route("/isAuthenticated", methods=['GET', 'POST'])
def isAuthenticated():
    from server import handleOneResult

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

@authontication_bp.route("/handleSignOut", methods=['GET', 'POST'])
def handleSignOut(): # Deletes session from user who signes out
    from server import handleUsers

    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    sessionID = json_str['sessionID']

    deletequery = f''' DELETE FROM session WHERE sessionID = '{sessionID}'; '''
    handleUsers(deletequery)

    return jsonify({'res': True})

