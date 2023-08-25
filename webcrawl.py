import sys
def web_crawl(query):
    return "This is the python script. I have received a query of " + str(query) + " however I couldn't do anything about it right now..."

if __name__ == "__main__":
    query = sys.argv[1]
    result = web_crawl(query)
    print(result) # We take the stdout and return it to frontend