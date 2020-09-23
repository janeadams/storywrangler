from dev.api.orm import app as application
if __name__ == "__main__":
    application.run()

"""
def application(env,resp):
    resp('200 OK',[('Content-Type','text/html')])
    return [b"Hello World!"]
"""
