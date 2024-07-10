from typing import Optional, List
import json
import os 

from flask import Flask
from flask_cors import CORS
import strawberry
from strawberry.flask.views import GraphQLView

import unidecode

class TrieNode:
    '''
    Class to implement a node in Trie data structure. Contains its character, childs, and whether it ends a string. 
    
    Trie is a tree with multiple 'final' nodes, each path to a final node represents a string.
    '''
    
    def __init__(self, character):
        self.character = character
        self.child_nodes = []
        self.final = False

    def add_node(self, node):
        '''
        Adds a TrieNode to the list of children, giving it high priority when DFS.
        '''
        self.child_nodes.insert(0, node)

    def find_child(self, character):
        '''
        Returns child node containing character or None, if there is no node.
        '''
        for i in self.child_nodes:
            if i.character == character:
                return i
        return None
        
class TrieSuggestor:
    '''
    Class to implement suggestor. Should give suggestions, read data on base suggestions and update them.
    '''
    def __init__(self, initial_data):
        '''
        Constructor

        initial_data (str or path-Like): Path to initial suggestions on a json file, 
        it should have a field 'buscas' with a list of str.
        '''
        self.initial_data = initial_data
        self.root_node = TrieNode('')

    def add_suggestion(self, suggestion:str):
        '''
        Adds suggestion to trie, gives high 'priority' for new suggestions.
        '''
        #search prefix
        curr_node = self.root_node
        for character in unidecode.unidecode(suggestion).lower():
            child = curr_node.find_child(character)
            if child is not None:
                curr_node = child
            else:
                #add rest
                new_node = TrieNode(character)
                curr_node.add_node(new_node)
                curr_node = new_node
        curr_node.final = True

    def dfs(self, current_node, current_string, current_matches):
        '''
        Search for up to 20 suggestions in the trie via Depth First Search
        '''
        found = []
        if current_matches[0] >= 20:
            return found

        if current_node.final:
            current_matches[0] += 1
        
        for i in current_node.child_nodes:
            found += self.dfs(i, current_string + current_node.character, current_matches)
        
        if current_node.final:  
            return [current_string + current_node.character] + found
        else:
            return found

    def get_suggestion(self, query:str) -> List[str]:
        '''
        Gets a list up to 20 sugestions if query larger than 4 characters.
        '''
        if len(query) < 4: 
            return []
        else:
            #Search prefix
            prefix = ""
            curr_node = self.root_node
            for character in unidecode.unidecode(query).lower():
                child = curr_node.find_child(character)
                if child is not None:
                    curr_node = child
                    prefix += character
                else:
                    return []
            #DFS
            return self.dfs(curr_node, prefix[:-1], [0])

    def parse_initial(self):
        '''
        Parses initial data according to the json initialized
        '''
        with open(self.initial_data, 'r') as arquivo_buscas:
            suggestions = json.load(arquivo_buscas)['buscas']

        for i in suggestions:
            self.add_suggestion(i)

suggestor = TrieSuggestor(os.path.join('data', 'buscas.json'))
suggestor.parse_initial()

@strawberry.type
class Query:
    
    @strawberry.field
    def getMatches(self, text: str) -> List[str]:
        
        return suggestor.get_suggestion(text)
    
@strawberry.type
class Mutation:
    
    @strawberry.field
    def setMatch(self, text: str) -> None:
        
        suggestor.add_suggestion(text)
        return
    
schema = strawberry.Schema(query=Query, mutation=Mutation)

app = Flask(__name__)
CORS(app)
app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql_view", schema=schema, graphiql=True),
)

if __name__ == "__main__":
    
    app.run(host='0.0.0.0', port=4000)
