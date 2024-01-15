from flask import Blueprint, jsonify, request

# Other Imports
import json

# Blue Print Set
notifications_bp = Blueprint('notifications', __name__)


# Route & Functions

@notifications_bp.route("/newNotifications", methods=['GET','POST'])
def newNotifications(): # Checks if user got any notifications => Gets the data of a notification
    from server import handleOneResult
    
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

