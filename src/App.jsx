import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './app/store';
import { ThemeProvider } from './context/ThemeContext';
import router from './routes';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
