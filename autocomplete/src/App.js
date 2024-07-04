import logo from './resources/jusbrasil.png'
import './App.css';
import {TextField} from '@material-ui/core'
import { useState } from 'react';

function App() {

  const [query, setQuery] = useState('none');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="Jus-logo"/>
        <div className='Buscador'>
          <a className = "Title">Busca com autocompletar</a>
          <p className = "Subtitle">Digite no campo abaixo para exibir sugetões</p>
          <TextField 
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
        </div>
      </header>

    </div>
  );
}

export default App;
