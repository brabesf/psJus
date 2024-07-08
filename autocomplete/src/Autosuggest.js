import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {TextField, Button} from '@material-ui/core'
import { useState } from 'react';


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
          <div>{loading?(
            <p></p>
            ) : (
            data.getMatches.map((text, index) => (
              <Button style={{backgroundColor: '#ffffff',
                color: 'black'
              }}
              onClick={() => setQuery(text)}          
              variant='contained'>{text}</Button>
              
            ))
          )}
          </div>
        </div>;
}

export default Autosuggest;