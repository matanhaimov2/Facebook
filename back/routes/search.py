from flask import Blueprint, jsonify, request

# Other Imports
import json


# Blue Print Set
search_bp = Blueprint('search', __name__)


# Route & Functions

@search_bp.route("/search", methods=['GET', 'POST'])
def search():
    from server import handleMultipleResults

    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    searchPhrase = json_str['searchPhrase']

    search_query =  f'''SELECT email, username, userimages FROM profiles WHERE username LIKE '%{searchPhrase}%' '''
    
    data = handleMultipleResults(search_query)

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


