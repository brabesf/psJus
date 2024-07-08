import logo from './resources/jusbrasil.png'
import './App.css';
import {TextField, Button} from '@material-ui/core'
import { useState } from 'react';
import Hello from './Hello';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

function App() {

  const [query, setQuery] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="Jus-logo"/>
        <div className='Buscador'>
          <a className = "Title">Busca com autocompletar</a>
          <p className = "Subtitle">Digite no campo abaixo para exibir sugetões</p>
          <div className='Input'>
            <Autocomplete
                id="highlights-demo"
                sx={{ width: 300 }}
                options={top100Films}
                getOptionLabel={(option) => option.title}
                renderInput={(params) => (
                  <TextField 
                  {...params}
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
                )}
                renderOption={(props, option, { inputValue }) => {
                  const { key, ...optionProps } = props;
                  const matches = match(option.title, inputValue, { insideWords: true });
                  const parts = parse(option.title, matches);

                  return (
                    <li key={key} {...optionProps}>
                      <div>
                        {parts.map((part, index) => (
                          <span
                            key={index}
                            style={{
                              fontWeight: part.highlight ? 700 : 400,
                            }}
                          >
                            {part.text}
                          </span>
                        ))}
                      </div>
                    </li>
                  );
                }}
              />

            <Button style={{backgroundColor: '#5555ff',
                            color: 'white',
                            flex: '1'
            }} 
            variant='contained'>BUSCAR</Button>
          </div>
        </div>
        <Hello text={query}></Hello>
      </header>

    </div>
  );
}

export default App;
