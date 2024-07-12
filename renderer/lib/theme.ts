import {createTheme} from '@mui/material/styles';
import {red} from '@mui/material/colors';
import { dark } from '@mui/material/styles/createPalette';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';



// Create a theme instance.
const theme = createTheme({
    /*palette: {
        mode: 'light',
        primary: {
          main: '#880e4f',
          
        },
        secondary: {
          main: '#9c27b0',
        },
        background:{
            default:'#2e2e2e'
        }
      },*/
      palette: {
        mode: 'light',
        primary: {
          main: '#880e4f',
        },
        secondary: {
          main: '#f50057',
        },
        background:{
          default:'#EEEEEE',
          paper:'#ffffff'
        }
      },
      typography:{
        fontFamily:'Roboto'
      }
});

export default theme;
