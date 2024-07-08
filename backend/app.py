from flask import Flask
from flask_cors import CORS
import strawberry
from strawberry.flask.views import GraphQLView
from typing import Optional, List
import json

class Suggestor:
    def __init__(self, initial_data):

        with open(initial_data, 'r') as arquivo_buscas:
            self.suggestions = json.load(arquivo_buscas)['buscas']

    def add_suggestion(self, suggestion):
        self.suggestions.append(suggestion)
    
    def get_suggestion(self, query):
        if len(query) < 4:
            return []
        return[i for i in self.suggestions if i.lower().startswith(query.lower())][:20]

suggestor = Suggestor("./data/buscas.json")

@strawberry.type
class Query:
    
    @strawberry.field
    def getMatches(self, text: str) -> List[str]:
        
        return suggestor.get_suggestion(text)
    
schema = strawberry.Schema(query=Query)

app = Flask(__name__)
CORS(app)
app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql_view", schema=schema, graphiql=True),
)

if __name__ == "__main__":
    
    app.run(host='0.0.0.0', port=4000)
