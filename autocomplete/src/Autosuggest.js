import React from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
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

function Autosuggest() {
  const [query, setQuery] = useState('');

  const GET_MATCHES = gql`
  query GetMatches($text: String!) {
    getMatches(text: $text)
  }
`;

const SET_MATCHES = gql`
  mutation SetMatch($text: String!) {
    setMatch(text: $text)
  }
`;

const [getMatches, { loading, error, data }] = useLazyQuery(GET_MATCHES);
const [setMatches, { loadingSet, errorSet, dataSet }] = useMutation(SET_MATCHES);

const handleClick = (text) => {
  setQuery(text);
};

const handleSearch = () => {
  setMatches({ variables: { text: query } });
};

const handleType = (event) => {
  setQuery(event.target.value);
  getMatches({ variables: { text: event.target.value } });
}

if (error) return (
  <div>
    <p>Error :(</p>
    <p>{error.message}</p>
  </div>
);

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
            backgroundColor: '#fff',
            width: '50vw'
          },
        }}
        onChange={handleType}
      />
      <Button
        style={{
          backgroundColor: '#5555ff',
          color: 'white',
          width: '5vw'
        }}
        variant='contained'
        onClick={handleSearch}
      >
        BUSCAR
      </Button>
    </div>
    <div className='Opcoes'>
      {loading ? (
        <p></p>
      ) : (
        data && data.getMatches.map((text, index) => {
          const firstPart = text.substring(0, query.length);
          const lastPart = text.substring(query.length);
          
          return (
            <OptionButton 
              key={index}
              onClick={() => handleClick(text)}
              variant='contained'
            >
              <span style={{ fontWeight: 700, whiteSpace: 'pre' }}>{firstPart}</span>
              <span style={{ fontWeight: 400 , whiteSpace: 'pre'}}>{lastPart}</span>
            </OptionButton>
          )
        })
      )}
    </div>
  </div>
);
}

export default Autosuggest;