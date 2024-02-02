import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';


function App() {
  const redirectToFullURL = () => {
    // Replace the URL with the full URL you want to redirect to
    window.location.href = 'https://congent.it/about';
  };
  return (
   <>
   <h1>
    Hello
   </h1>
   <Link to="/app/test">Click Me</Link>
   </>
  );
}

export default App;
