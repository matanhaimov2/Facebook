from flask import Blueprint, jsonify, request

# Other Imports
import json


# Blue Print Set
home_bp = Blueprint('home', __name__)


# Route & Functions

# --- Feed
@home_bp.route("/getPostsToFeed", methods=['GET', 'POST'])
def getPostsToFeed(): # Get post/s from db to feed
    from server import handleMultipleResults
    
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

        # print(one_array_allPosts, 'here')

        return jsonify(res)

    return jsonify({'res': False, 'data' : []})

# --- FriendsOnline
@home_bp.route("/friendsStatus", methods=['GET', 'POST'])
def friendsStatus(): # Fetchs friends data and checks their statuses
    from server import handleUsers, handleOneResult, handleMultipleResults
    
    data = request.data
    print(data)
    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    friends_query = f"SELECT friends FROM handlefriends WHERE user_email = '{email}';"
    print(friends_query)
    
    # Get user's allfriends 
    friends_list = handleOneResult(friends_query)

    allFetchedUsers = []

    if friends_list[0]:
        friends_list = json.loads(friends_list[0])
        for emailAddress in friends_list:
            clean_email_address = emailAddress.strip('"') # from "example@gmail.com" => example@gmail.com
            fetch_data_query = f"SELECT username, userimages FROM profiles WHERE email = '{clean_email_address}' " 
            fetched_users = handleMultipleResults(fetch_data_query)
            username = fetched_users[0][0]
            user_image = fetched_users[0][1]

            status_user_query = f"SELECT username FROM session WHERE username = '{username}' " 
            isStatus = handleUsers(status_user_query)
            if isStatus:

                # Structure 
                allFetched = {
                    'username': username,
                    'userimages': user_image,
                    'status': 'Online'
                } 

                # print(allFetched, 'User Is Online')

                allFetchedUsers.append(allFetched)

            else:

                # Structure 
                allFetched = {
                    'username': username,
                    'userimages': user_image,
                    'status': 'Offline'
                } 

                # print(allFetched, 'User Is Offilne')

                allFetchedUsers.append(allFetched)

        return jsonify({'res': True, 'Data': allFetchedUsers})


    return jsonify({'res': False, 'Note': 'No Friends'})

