from flask import Flask, request
from flask_cors import CORS
from flask_mysqldb import MySQL
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
    
    query = '''INSERT INTO register(firstname, lastname, email, birthday, sex, password) VALUES ('{}','{}','{}','{}','{}','{}')'''.format(firstname, lastname, email, birthday, sex, password)
    print(query)
    response = handleUsers(query)
    print (response)

    return "Hello World!"


@app.route("/login", methods=['GET', 'POST'])
def login():
    return "Hello World!"

if __name__ == "__main__":
    app.run(debug = True)