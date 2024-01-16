from flask import Blueprint, jsonify, request

# Other Imports
from datetime import datetime
import json

# Blue Print Set
profiles_bp = Blueprint('profiles', __name__)



# Route & Functions

@profiles_bp.route("/setprofile", methods=['GET', 'POST'])
def setprofile(): # Adds info about the user to db
    from server import handleUsers
    
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

@profiles_bp.route("/profile", methods=['GET', 'POST'])
def profile(): # Gets full data from db about the user
    from server import handleOneResult

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

@profiles_bp.route("/uploadimage", methods=['GET', 'POST'])
def uploadimage(): # Sends uploaded profile image to db
    from server import handleUsers

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

@profiles_bp.route("/getProfileImage", methods=['GET', 'POST'])
def getProfileImage(): # Gets from db an uploaded profile image
    from server import handleOneResult

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

@profiles_bp.route("/deleteProfileImage", methods=['GET', 'POST'])
def deleteProfileImage(): # Delete from db a profile image
    from server import handleUsers

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

@profiles_bp.route("/uploadPost", methods=['GET', 'POST'])
def uploadPost(): # Upload post/s to db
    from server import handleUsers, handleOneResult, genereteSessionID

    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']
    uploadedtext = json_str['UploadedText']
    uploadedimg = json_str['UploadedImg']
    uploadedprivacy = json_str['UploadedPrivacy']

    post = {
        'ID' : genereteSessionID(40),
        'Email' : email,
        'Text': uploadedtext,
        'Image': uploadedimg,
        'Privacy': uploadedprivacy,
        'date': str(datetime.now()),
        'Likes': ''
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

@profiles_bp.route("/getProfilePost", methods=['GET', 'POST'])
def getProfilePost(): # Get post/s from db
    from server import handleOneResult

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


        return jsonify(res)
    
    return jsonify({'res': False, 'data' : []})

# Post
@profiles_bp.route("/likePost", methods=['GET', 'POST'])
def likePost(): # Gets userposts from db and adds or removes like
    from server import handleUsers, handleOneResult

    data = request.data
    
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    id = json_str["ID"]
    email = json_str["Email"]
    likeOrDislike = json_str["LikeOrDislike"]
    postCreator = json_str["PostCreator"]

    query = f"""
        SELECT userposts FROM profiles WHERE email = '{postCreator}'
    """

    response = handleOneResult(query)
    response = response[0]

    posts = json.loads(response)

    targetPost = None
    allPosts = []
    
    # Get Target Post
    for post in posts:
        post = json.loads(post)
     
        if(post["ID"] == id):
            targetPost = post
        else: 
            allPosts.append(json.dumps(post))

            
    # Add Like or Remove like
    thereAreLikes = targetPost.get('Likes', None)

    if(likeOrDislike): 
        # Like accured plus 1
        if(thereAreLikes and len(thereAreLikes) > 0): # There are preivous likes     
            targetPost["Likes"].append(email) 
        else: # No Likes what so ever
            targetPost["Likes"] = [email]
    else: 
        # Dilike accured minus 1
        
        if(thereAreLikes and len(thereAreLikes) > 0): # There are preivous likes
            targetPost["Likes"].remove(email) 
        else: # No Likes what so ever
            targetPost["Likes"] = []

    # After like or dislike has been changed - Update the DB
    allPosts.append(json.dumps(targetPost)) # add the newly updated post 
    
    # Convert the array back to fit the sql query
    allposts_str = ',\n'.join(f"'{postFromAllPosts}'" for postFromAllPosts in allPosts)
    
    query = f'''UPDATE profiles
        SET userposts = JSON_ARRAY(
            {allposts_str}
        )
        WHERE email = '{postCreator}';
    '''

    handleUsers(query)
   
    return jsonify({'res': True})