import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import rootReducer from "./reducer"
import { configureStore } from "@reduxjs/toolkit";
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

export const store=configureStore({
  reducer:rootReducer,
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Provider store={store}>
    <BrowserRouter>
    <Toaster/>
    <App />
    </BrowserRouter>
    </Provider>
  </>
);

