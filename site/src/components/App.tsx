import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from './routes/home/HomePage';
import settings from '../../settings';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00704A',
    },
    secondary: {
      main: green[500],
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={settings.repoPath}>
        <Switch>
          <Route exact path="/" component={HomePage} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}
