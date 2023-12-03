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
        print(posts)

        allposts = []

        for post in posts:
            allposts.append(json.loads(post))

    if(response != None):

        res = {
            'data' : allposts,
            'res': True
        }    

        return jsonify(res)
    
    return jsonify({'res': False, 'data' : []})


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

    print(product)

    query = '''SELECT products FROM marketplace WHERE user_email = '{}' '''.format(email) 
 
    # Get products where email from db
    products = handleOneResult(query)

    products = products[0]

    print(products)

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
    print(response,'heree')
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

    print(response)
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
# 1. Marketplace
# 2. 

# Can't Tell Tasks:
# 1. Every new post uploaded by user will appear up so thats the first post in the column
# 2. make a skeleton while loading profile data

# Easy Tasks:
# 1. for search - move between option using buttons 
# 2. for post when there are no posts show a messege (how to do it, problem with jsx if else. (shlomi))

# Video tasks:
# 1. learn react classes in udemy.
# 2.  

# Problems
# 1. in productUpload, enter key opens file
# 2. db json columns cant get hebrew words


# Marketplace Related Tasks:
# 1. figure out a way to chunk 6 products in one chunk => make a map ----- VVV
# 2. format date problem
# 3. figure out a way to import every product to a single page ----------- VVV
# 4. cities api