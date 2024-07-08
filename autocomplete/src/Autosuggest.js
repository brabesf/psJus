import React from 'react';
import { useQuery, gql } from '@apollo/client';
import {TextField, Button} from '@material-ui/core'
import { useState } from 'react';
import './styles/Autosuggest.css';
import { withStyles } from '@material-ui/core/styles';

const OptionButton = withStyles({
  root: {
    backgroundColor: '#ffffff',
    color: 'black',
    width: `50vw`,
    justifyContent: `flex-start`,
    textTransform: 'none',
    height: '3vh',
    overflowX: 'clip',
    '&:hover': {
      backgroundColor: '#aaf',
      borderColor: '#0000ff',
    }
  }
})(Button);



function Autosuggest(props) {
  const [query, setQuery] = useState('');

  const GET_HELLO = gql`
  query GetMatches($text: String!) {
    getMatches(text: $text)
  }
`;
  
  const { loading, error, data } = useQuery(GET_HELLO, {
    variables: { text: query },
  });

  if (error) return <div>
                        <p>Error :(</p>
                        <p>{error.message}(</p>
                    </div>;
  return (
        <div>
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
                width: '50vw'
              },
            }}
            onChange={(event) => (setQuery(event.target.value))}/>

            <Button style={{backgroundColor: '#5555ff',
                          color: 'white',
                          
                          width: '5vw'
            }} 
            variant='contained'>BUSCAR</Button>
          </div>

          <div className='Opcoes'>{loading?(
            <p></p>
            ) : (
            data.getMatches.map((text, index) => {
              const firstPart = text.substring(0, query.length);
              const lastPart = text.substring(query.length);
              
              return (
                <OptionButton 
                onClick={() => setQuery(text)}  
                      
                variant='contained'>
                  <span style={{ fontWeight: 700, whiteSpace: 'pre' }}>{firstPart}</span>
                  <span style={{ fontWeight: 400 , whiteSpace: 'pre'}}>{lastPart}</span>
                </OptionButton>
              )

            })
          )}
        </div>
      </div>);
}

export default Autosuggest;