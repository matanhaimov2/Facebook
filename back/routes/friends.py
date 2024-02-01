from flask import Blueprint, jsonify, request

# Other Imports
import json

# Blue Print Set
friends_bp = Blueprint('friends', __name__)


# Route & Functions

@friends_bp.route("/acceptFriend", methods=['GET','POST'])
def acceptFriend(): # Friend acception => both added in db to each other
    from server import handleUsers, handleOneResult
    
    data = request.data

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

@friends_bp.route("/ignoreFriend", methods=['GET','POST'])
def ignoreFriend(): # Friend ignore => notification gets delete for the user
    from server import handleUsers
    
    data = request.data

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
    
@friends_bp.route("/startFriendRequest", methods=['GET','POST'])
def startFriendRequest(): # Starts friend request => info to column notifcations
    from server import handleUsers, handleOneResult, handleMultipleResults
    
    data = request.data

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

@friends_bp.route("/checkFriend", methods=['GET','POST'])
def checkFriend(): # Checks if user got any friends
    from server import handleOneResult
    
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str["UserEmail"]
    friend_email_to_check  = json_str["Email"]

    query = '''SELECT friends FROM handlefriends WHERE user_email = '{}' '''.format(email) 
    friends = handleOneResult(query)

    if friends:
        friends = friends[0]

        friends_list = json.loads(friends)

        # Check if the friend_email_to_check is in the list with quotes
        if f'"{friend_email_to_check}"' in friends_list:
            pass # Success! Friend found

        else:
            # Friend not found in the list
            
            return jsonify({'res': False, 'Note': 'Users Arent Friends'})

    else:
        return jsonify({'res': False, 'Note': 'No Friends For The User'})


    return jsonify({'res': True})

@friends_bp.route("/hasFriendsAtAll", methods=['GET','POST'])
def hasFriendsAtAll(): # Displays the number of friends user have
    from server import handleOneResult, handleMultipleResults
    
    data = request.data

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

        friends_length = 0 

        if friends[0]:
            friends = friends[0]

            friends_list = json.loads(friends)
            friends_length = len(friends_list)
            return jsonify({'res': True, 'friendsLengthNumber': friends_length})

        else:
            friends_length = 0
            return jsonify({'res': True, 'friendsLengthNumber': friends_length, 'Note': 'No Friends For The User'})
                    

    # Displaying for profile(displayfriends) friends data
    else:
        
        friends = handleOneResult(query)
        allFetchedUsers = []

        
        if friends[0]:
            friends = friends[0]

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

@friends_bp.route("/getAllUsersFromFriendsDB", methods=['GET','POST'])
def getAllUsersFromFriendsDB():
    from server import handleOneResult, handleMultipleResults
    
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str.get("Email")

    # get all friends of the user logged in 
    query = f"SELECT friends FROM handlefriends WHERE user_email = '{email}';"
    unwantedFriends = handleOneResult(query)

    allFetchedUsers = []

    if unwantedFriends[0]: # if user have friends
        unwantedFriends = unwantedFriends[0]

        unwantedFriends = json.loads(unwantedFriends)

        # add the logged in user to the list of unwanted
        unwantedFriends.append('"' + email + '"')

        # convert them to tuple
        unwantedFriendsTuple = tuple(friend.strip('"') for friend in unwantedFriends)

        # fetch all wanted friends (those who aren't friends with the logged in user)
        filterQuery = f"""
            SELECT user_email FROM handlefriends
            WHERE user_email NOT IN {unwantedFriendsTuple};
        """
        suitableFriends = handleMultipleResults(filterQuery)

        # convert to array with the right syntax 
        formatted_suitableFriends_emails = [f'"{email[0]}"' for email in suitableFriends]
    
    else: # if user doesnt have friends

        # fetch every email existed
        fetchEmailQuery = f"SELECT user_email FROM handlefriends;"
        unwantedFriends = handleMultipleResults(fetchEmailQuery)

        # convert to array with the right syntax 
        formatted_unwantedFriends_emails = [f'"{email[0]}"' for email in unwantedFriends] 

        # Filter out unwanted email (logged in user) - iterates through all emails and keeps only the email needed
        formatted_suitableFriends_emails = [mail for mail in formatted_unwantedFriends_emails if mail != f'"{email}"']


    for emailAddress in formatted_suitableFriends_emails:
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

@friends_bp.route("/deleteFriendRequest", methods=['GET','POST'])
def deleteFriendRequest(): # Deletes friendship of each other
    from server import handleUsers, handleOneResult
    
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str["Email"]
    friend_email = json_str["FriendEmail"]

    query = f'''SELECT friends FROM handlefriends WHERE user_email = '{email}' '''
    response = handleOneResult(query)
    friends = response[0]
    friends_list = json.loads(friends)

    # for deleting friend from current user that logged in
    updated_friends_list = []
    str_friend_email = '"' + friend_email + '"'

    # for deleting friend from his user
    updated_his_friends_list = []
    str_email = '"' + email + '"'

    for friend in friends_list:
        # if wanted-friend-delete is not in the list
        if friend != str_friend_email:
            updated_friends_list.append(json.dumps(friend))

        # if wanted-friend-delete is on the list - Remove Him
        else:
            # Friend Is Removed From Current User Logged In


            # Deletes from his friend list, the logged in user
            select_friend_query = f'''SELECT friends FROM handlefriends WHERE user_email = '{friend_email}' '''
            friend_response = handleOneResult(select_friend_query)
            friend_response = friend_response[0]

            his_friends_list = json.loads(friend_response)

            for friend in his_friends_list:
                # if wanted-friend-delete is not in the list
                if friend != str_email:
                    updated_his_friends_list.append(json.dumps(friend))

                # if wanted-friend-delete is on the list - Remove Him
                else:
                    pass # Friend Is Removed From His User
                    
            # print('Friend List Of His User', updated_his_friends_list)


            his_sql_query = f"""
                UPDATE handlefriends
                SET friends = JSON_ARRAY({', '.join(updated_his_friends_list)})
                WHERE user_email = '{friend_email}';
            """
            handleUsers(his_sql_query)


    # print('Friend List Of Logged In User', updated_friends_list)

    sql_query = f"""
        UPDATE handlefriends
        SET friends = JSON_ARRAY({', '.join(updated_friends_list)})
        WHERE user_email = '{email}';
    """
    handleUsers(sql_query)

    return jsonify({'res': True})

@friends_bp.route("/isFriendPending", methods=['GET', 'POST'])
def isFriendPending(): # Checks if signed in user still has a friend request wating for approval from other user
    from server import handleOneResult
    
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']
    friendEmail = json_str['friendEmail']
    

    friendsNotifications = f"SELECT notifications FROM profiles WHERE email = '{friendEmail}';"
    response = handleOneResult(friendsNotifications)
  
    friends = response[0]
    boole = False 
    if friends:
        friends = json.loads(friends)
        
        for friend in friends:
            friend = json.loads(friend)

            if friend['Email']==email:
                boole = True

    if boole:
        return jsonify({'res': True, 'pending' : True})
    else:
        return jsonify({'res': True, 'pending' : False})
    
@friends_bp.route("/oneFriendRequestCheck", methods=['GET', 'POST'])
def oneFriendRequestCheck(): # Checks if user has a friend request
    from server import handleOneResult
    
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str["UserEmail"]
    friend_email_to_check  = json_str["Email"]

    query = '''SELECT notifications FROM profiles WHERE email = '{}' '''.format(email) 
    response = handleOneResult(query)

    if response[0]:
        if friend_email_to_check in response[0]:
            # user is waiting for friend approval

            return jsonify({'res': True, 'Note': 'user is waiting for friend approval'})

    else:
        pass # theres no request waiting

    return jsonify({'res': False})

@friends_bp.route("/friendsStatus", methods=['GET', 'POST'])
def friendsStatus(): # Fetchs friends data and checks their statuses
    from server import handleUsers, handleOneResult, handleMultipleResults
    
    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    friends_query = f"SELECT friends FROM handlefriends WHERE user_email = '{email}';"
    
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

