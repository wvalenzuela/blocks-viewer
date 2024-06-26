import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { SideBar, ToolBar, ViewerContainer } from './components';
import ApolloClientProvider from './apollo';
import {Routes, Route} from 'react-router-dom';
import BlocksCRUDOperations from "./components/Blocks-CRUD-Operations";
const defaultTheme = createTheme();

export default function App() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ApolloClientProvider>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <ToolBar open={open} toggleDrawer={toggleDrawer} />
          <SideBar open={open} toggleDrawer={toggleDrawer} />
          <Box
            component='main'
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
                <Routes>
                    <Route path='/viewer' element={<ViewerContainer/>}/>
                    <Route  path='/create-Block' element={<BlocksCRUDOperations/>}/>
                </Routes>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </ApolloClientProvider>
  );
}
