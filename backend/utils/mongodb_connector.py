from pymongo import MongoClient
def get_db_handle(db_name, host=None, port=None, username=None, password=None, conn_string=None):

    if conn_string:
        client = MongoClient(conn_string)

    else:
        client = MongoClient(host=host,
                        port=int(port),
                        username=username,
                        password=password
                        )

    db_handle = client[db_name]
    return db_handle, client