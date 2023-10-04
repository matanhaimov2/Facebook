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

    # Get full data about the email including his hashed password (fetch)
    response = handleUsersLogin(query)

    if(response):
        # Save the password of the searched email
        usersHasedPassword = response[6].encode()

        # check if they are the same
        checker = bcrypt.checkpw(password.encode(), usersHasedPassword)

        sql_query = '''SELECT * FROM register WHERE firstlogin = '{}' AND email = '{}' '''.format(1, email) # Checks if this is the first login for the specific user 
        print(sql_query)
    else:
        checker = False

    # If the hased save password in the db and the password that was inserted by the user are the same enter
    if (checker):
        response = handleUsers(sql_query)
        print(response)
        if (response == 1):
            return jsonify({'res' : True, 'data': {'email' : email}, 'firstlogin': False})
        fLoginquery = '''UPDATE register SET firstlogin = 1  WHERE email = '{}' '''.format(email) # Updates that the specific user entered more then once
        handleUsers(fLoginquery)
        
        return jsonify({'res' : True, 'data': {'email' : email} , 'firstlogin': True})
    else:
        return jsonify({'res': False, 'err': 'Email or Password are Incorrect'})
    
    return jsonify({'res': False})


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

        if(username):
            query = f'''UPDATE profiles SET username = '{username}', biography = '{biography}', relationshipstatus = '{relationshipstatus}', occupation = '{occupation}', school = '{school}', address = '{address}' WHERE email = '{email}' '''
        else: # In case of editing profile
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
        
        print(query)
        
        
        # Send the query - can be update (for exsiting user) or set (for new user)
        response = handleUsers(query)

        return jsonify({'res': True})

    else: # Username exists, alert the user    
        return jsonify({'res': False, 'err' : 'Username Exists'})

    return jsonify({'res': False})

@app.route("/profile", methods=['GET', 'POST'])
def profile():
    data = request.data
   
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    query = '''SELECT * FROM profiles WHERE email = '{}' '''.format(email) 
    print(query)

    # Get full data about the email from db
    response = handleUsersLogin(query)
    
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
    response = handleUsersLogin(query)
    
    if(len(response[0]) > 0):
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

@app.route("/uploadPost", methods=['GET', 'POST'])
def uploadPost():
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']
    uploadedpost = json_str['UploadedPost']
    print(uploadedpost)

    query = f'''UPDATE profiles SET userposts = '{uploadedpost}' WHERE email = '{email}' '''
    print(query)

    response = handleUsers(query)


    return jsonify({'res': True})

@app.route("/getProfilePost", methods=['GET', 'POST'])
def getProfilePost():
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    query = '''SELECT userposts FROM profiles WHERE email = '{}' '''.format(email) 
    print(query)
    
    # Get userimage where email from db
    response = handleUsersLogin(query)
    
    if(len(response[0]) > 0):
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



# HealthCheck
@app.route("/healthCheck", methods=['GET', 'POST'])
def healthCheck():
    return jsonify({'res': True})



if __name__ == "__main__":
    app.run(debug = True)



