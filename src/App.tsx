import './App.css'
import TheForm from './components/Shared/form/TheForm';
import { validate } from './components/Shared/form/validation';

function App() {
 return (
   <div className="w-full h-screen text-7xl font-bold flex-center">
   
     <TheForm header='FORM' validate={validate}/>
   </div>
 );
}

export default App
