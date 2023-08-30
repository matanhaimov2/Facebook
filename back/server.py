from flask import Flask, request
from flask_cors import CORS
from flask_mysqldb import MySQL
from flask import jsonify
import json


app = Flask(__name__)
mysql = MySQL(app)
CORS(app)

# Config MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Matan2000'
app.config['MYSQL_DB'] = 'facebook_db'

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

    # Check if mail exists
    query = '''SELECT email FROM register WHERE EXISTS (SELECT email FROM register WHERE email = '{}');'''.format(email)
    response = handleUsers(query)
  
    if(response == 0): # If doesn't exist create the new user
        query = '''INSERT INTO register(firstname, lastname, email, birthday, sex, password, firstlogin) VALUES ('{}','{}','{}','{}','{}','{}', '{}')'''.format(firstname, lastname, email, birthday, sex, password, firstlogin)
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

    query = '''SELECT * FROM register WHERE email = '{}' AND password = '{}' '''.format(email, password) # Checks if the db has the email and password (if the user is correct)
    print(query)

    response = handleUsers(query)
    print(response)

    sql_query = '''SELECT * FROM register WHERE firstlogin = '{}' AND email = '{}' '''.format(1, email) # Checks if this is the first login for the specific user 
    print(sql_query)

    if (response == 1):
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
        query = '''UPDATE profiles SET username = '{}', biography = '{}', relationshipstatus = '{}', occupation = '{}', school = '{}', address = '{}' WHERE email = 'shlomihaimov@gmail.com' '''.format(username, biography, relationshipstatus ,occupation, school, address)
        print(query)
        response = handleUsers(query)

        return jsonify({'res': True})

    else: # Username exists, alert the user    
        return jsonify({'res': False, 'err' : 'Username Exists'})

    return jsonify({'res': False})

if __name__ == "__main__":
    app.run(debug = True)

# 2 problems:
# 1: I want all the values to go to a certain email in db so the query will know which row to fill.
# my way is transfer email value from login page to setprofile page and from there sending it to the back with the other 5 values

# 2: db can't get NULL values, so if user doesn't want to insert biography for example, he can't.