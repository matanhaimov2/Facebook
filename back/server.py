from flask import Flask, request
from flask_cors import CORS
from flask_mysqldb import MySQL


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

    print(data)
    # Extract data
    firstname = data[0]
    lastname = data[1]
    email = data[2]
    birthday = data[3]
    sex = data[4]
    password = data[5]

    query = '''INSERT INTO register(firstname, lastname, email, birthday, sex, password) VALUES ({},{},{},{},{},{})'''.format(firstname, lastname, email, birthday, sex, password)
    print(query)
    # response = handleUsers(query)
    # print (response)

    return "Hello World!"


@app.route("/login", methods=['GET', 'POST'])
def login():
    return "Hello World!"

if __name__ == "__main__":
    app.run(debug = True)