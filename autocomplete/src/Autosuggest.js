import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {TextField, Button} from '@material-ui/core'
import { useState } from 'react';
import './styles/Autosuggest.css';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

function Autosuggest(props) {
  
  const [query, setQuery] = useState('');
  
  var GET_HELLO = gql`
  query {
    getMatches(text: "${query}")
  }
  `;
  const { loading, error, data } = useQuery(GET_HELLO);

  if (error) return <div>
                        <p>Error :(</p>
                        <p>{error.message}(</p>
                    </div>;
  return <div>
          <div className='Input'>
            <TextField 
            value={query}
            label='Procure em Jusbrasil'
            className="Text-field"
            variant='filled'
            size='small'
            InputProps={{
              style: {
                backgroundColor: '#fff', // Change this to your desired color
                minWidth: '35vw'
              },
            }}
            onChange={(event) => setQuery(event.target.value)}/>

            <Button style={{backgroundColor: '#5555ff',
                          color: 'white',
                          flex: '1'
            }} 
            variant='contained'>BUSCAR</Button>
          </div>
          <div className='Opcoes'>{loading?(
            <p></p>
            ) : (
            data.getMatches.map((text, index) => {
              const firstPart = text.substring(0, query.length); // First 4 characters
              const restPart = text.substring(query.length); // Rest of the text
              return (
              <Button style={{backgroundColor: '#ffffff',
                color: 'black',
                minWidth: `35vw`,
                justifyContent: `flex-start`,
                textTransform: 'none',
                height: '3vh',
                fontWeight: index<4? 700: 400
              }}
              onClick={() => setQuery(text)}          
              variant='contained'>
                <span style={{ fontWeight: 700 }}>{firstPart}</span>
                <span style={{ fontWeight: 400 }}>{restPart}</span>
              </Button>
              )
            }
            )
          )}
          </div>
        </div>;
}

export default Autosuggest;