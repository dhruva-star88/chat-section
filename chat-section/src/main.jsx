import ReactDOM from 'react-dom/client';  // Import the createRoot method
import { Provider } from 'react-redux';  
import store from './store';
import App from './App';

// Create a root element and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));  // Create root
root.render(  // Use render method on the root object
  <Provider store={store}>
    <App />
  </Provider>
);
