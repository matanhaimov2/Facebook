from flask import Flask, request
from flask_cors import CORS
from flask_mysqldb import MySQL
from flask import jsonify
import json
import bcrypt

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

def handleUsersLogin(query): 
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
        print(query)
        response = handleUsers(query)
    
        return jsonify({'res': True})

    else: # Email exists, alert the user
        
        return jsonify({'res': False, 'err': 'Email Exists'})

    return jsonify({'res': False})


@app.route("/login", methods=['GET', 'POST'])
def login():
    data = request.data
   
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]
    password = json_str["Password"]

    query = '''SELECT * FROM register WHERE email = '{}' '''.format(email) 
    print(query)

    # Get full data about the eamil including his hashed password
    response = handleUsersLogin(query)

    # Save the password of the searched email
    usersHasedPassword = response[6].encode()

    # check if they are the same
    checker = bcrypt.checkpw(password.encode(), usersHasedPassword)

    sql_query = '''SELECT * FROM register WHERE firstlogin = '{}' AND email = '{}' '''.format(1, email) # Checks if this is the first login for the specific user 
    print(sql_query)

    # If the hased save password in the db and the password that was inserted by the user are the same enter
    if (checker):
        response = handleUsers(sql_query)
        print(response)
        if (response == 1):
            return jsonify({'res' : True, 'firstlogin': False})
        fLoginquery = '''UPDATE register SET firstlogin = 1  WHERE email = '{}' '''.format(email) # Updates that the specific user entered more then once
        handleUsers(fLoginquery)
        
        return jsonify({'res' : True, 'firstlogin': True})
    else:
        return jsonify({'res': False, 'err': 'Email or Password are Incorrect'})
    
    return jsonify({'res': False})


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
    query = '''SELECT username FROM profiles WHERE EXISTS (SELECT username FROM profiles WHERE username = '{}');'''.format(username)

    response = handleUsers(query)
    print(response)

    if (response == 0): # If doesn't exist, continue
        query = '''UPDATE profiles SET username = '{}', biography = '{}', relationshipstatus = '{}', occupation = '{}', school = '{}', address = '{}' WHERE email = '{}' '''.format(username, biography, relationshipstatus ,occupation, school, address, email)
        print(query)
        response = handleUsers(query)

        return jsonify({'res': True})

    else: # Username exists, alert the user    
        return jsonify({'res': False, 'err' : 'Username Exists'})

    return jsonify({'res': False})


@app.route("/healthCheck", methods=['GET', 'POST'])
def healthCheck():
    return jsonify({'res': True})



if __name__ == "__main__":
    app.run(debug = True)


# 1: I want all the values to go to a certain email in db so the query will know which row to fill.
# cant find in google how to get data from localstorage to flask
