from flask import Blueprint, jsonify, request

# Other Imports
from datetime import datetime
import json

# Blue Print Set
marketplace_bp = Blueprint('marketplace', __name__)


# Route & Functions
@marketplace_bp.route("/uploadProduct", methods=['GET', 'POST'])
def uploadProduct(): # Upload product/s to db
    from server import handleUsers, handleOneResult

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

    query = '''SELECT products FROM marketplace WHERE user_email = '{}' '''.format(email) 
 
    # Get products where email from db
    products = handleOneResult(query)

    products = products[0]

    if (products == None): # If db-products has no image in it

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

@marketplace_bp.route("/editProduct", methods=['GET', 'POST'])
def editProduct(): # Edit product in marketplace
    from server import handleUsers

    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']
    index = json_str['Index']
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

    # Convert Python dictionary to a JSON string
    product_json = json.dumps(product)

    # Adjusted SQL query with variables directly in the string
    edit_query = f"""
        UPDATE marketplace
        SET products = JSON_REPLACE(
            products,
            CONCAT('$[{index}]'),
            CAST('{product_json}' AS CHAR CHARACTER SET utf8mb4)
        )
        WHERE user_email = '{email}'
    """
    
    response = handleUsers(edit_query)


    return jsonify({'res': True})

@marketplace_bp.route("/getSpecificProduct", methods=['GET', 'POST'])
def getSpecificProduct(): # Get product/s from db to a specific user
    from server import handleOneResult

    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    query = '''SELECT products FROM marketplace WHERE user_email = '{}' '''.format(email) 
    
    # Get product where email from db
    response = handleOneResult(query)
    response = response[0]

    if (response):
        products = json.loads(response)

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

@marketplace_bp.route("/getAllProduct", methods=['GET', 'POST'])
def getAllProduct(): # Get product/s from db for everyone
    from server import handleMultipleResults

    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    email = json_str["Email"]

    query = '''SELECT products FROM marketplace'''
    response = handleMultipleResults(query)

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

@marketplace_bp.route("/deleteProductRequest", methods=['GET', 'POST'])
def deleteProductRequest(): # Delete product from marketplace - PENDING...

    from server import handleUsers, handleOneResult, handleMultipleResults

    data = request.data

    str_data = data.decode('utf-8') # From binary to string
    json_str = json.loads(str_data) # From string to json

    # Set values
    email = json_str['Email']
    index = json_str['Index']

    deleteQuery = f"UPDATE marketplace SET products = JSON_REMOVE(products, '$[{index}]') WHERE user_email = '{email}'"

    response = handleUsers(deleteQuery)


    return jsonify({'res': True})