import logo from './resources/jusbrasil.png'
import './styles/App.css';
import Autosuggest from './components/Autosuggest';

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="Jus-logo"/>
        <div className='Buscador'>
          <a className = "Title">Busca com autocompletar</a>
          <p className = "Subtitle">Digite no campo abaixo para exibir sugetões</p>
          <Autosuggest/>
        </div>
        
      </header>

    </div>
  );
}

export default App;
