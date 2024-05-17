import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import App from './App';
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:3001'; // Server URL for API call

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <MantineProvider defaultColorScheme="auto">
        <Notifications />
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </MantineProvider>
  </React.StrictMode>
);