from flask import Flask
from flask_cors import CORS
import strawberry
from strawberry.flask.views import GraphQLView
from typing import Optional, List

def get_matches(text: str) -> List[str]:
    possible = ['a', 'as', 'asw', 'you', 'aser']
    return [i for i in possible if text in i]

@strawberry.type
class Query:
    @strawberry.field
    def getMatches(self, text: str) -> List[str]:
        
        return get_matches(text)
    
schema = strawberry.Schema(query=Query)

app = Flask(__name__)
CORS(app)
app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql_view", schema=schema, graphiql=True),
)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4000)
