import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Container, CssBaseline } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import axiosInstance from '../Axios.tsx';


interface Stock {
  title: string;
  symbol: string;

}

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function StockSearchBar() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Stock[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [inputValue, setInputValue] = React.useState<string>('');
  const [selectedStock, setSelectedStock] = React.useState<Stock | null>(null);

  const initialFormData  = Object.freeze({
    query: '',
    
  });

  const [formData, updateFormData] = React.useState(initialFormData);

//   Fetch options from an API
//   const fetchOptions = async (query: string) => {
//     setLoading(true);
//     try {
//         const response = await axios.get<Stock[]>(`/api/stocks`, {
//             params: { query }
//         });
//         setOptions(response.data);
//     } catch (error) {
//         console.error('Failed to fetch stock options', error);
//     } finally {
//         setLoading(false);
//     }
// };

const handleInputChange = (event: React.SyntheticEvent<Element, Event>, value: string, reason: 'input' | 'reset' | 'clear') => {
    setInputValue(value);
    if (value) {
        console.log(value);
    } else {
        setOptions([]);
    }
};
  const handleOpen = () => {
    setOpen(true);
    (async () => {
      setLoading(true);
      await sleep(1e3); // For demo purposes.
      setLoading(false);

      setOptions([...topStocks]);
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({
        ...formData,

        //trimming whitespace
        [e.target.name]: e.target.value.trim(),
    });
};
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(selectedStock);

    axiosInstance.defaults.xsrfCookieName = 'csrftoken';
    axiosInstance.defaults.xsrfHeaderName = 'X-CSRFToken';

    axiosInstance
        .get('api/news/', {
            params: { q: selectedStock },
            headers: {
                'X-CSRFToken': localStorage.getItem('csrftoken'),
            },
        })
        .then((res) => {
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            axiosInstance.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
            navigate('/mynews');
        })
        .catch((err) => {
            console.log(err.response);
            if (err.response) {
                if (err.response.status === 401) {
                    console.error(err.response.data.detail);
                    setError(err.response.data.detail);
                } else {
                    console.error('An error occurred:', err.response.data);
                }
            } else {
                console.error('Network error or server not responding');
            }
        });
  };


  return (
    <Box mt={20} p={2} display="flex" justifyContent="center">
        <Paper
            
            component="form"
            onSubmit={handleSubmit}
            elevation={3}
            style={{ display: 'flex', alignItems: 'center', width: '50%', padding: '0 8px', borderRadius: '4px', margin: 'auto' }}
        >
            <Autocomplete
                freeSolo
                disableClearable
                onOpen={handleOpen}
                onAbort={handleClose}
                options={topStocks.map((option) => option.title)}
                onInputChange={(event: React.SyntheticEvent, newInputValue: string) => setInputValue(newInputValue)}
                onChange={(event: React.SyntheticEvent, newValue: string | null) => setSelectedStock(newValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                        fullWidth
                        style={{ marginRight: '8px' }}
                    />
                )}
                style={{ flex: 1 }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
            >
                Search
            </Button>
        </Paper>
    </Box>

  );
}

const topStocks = [
  { title: 'Apple', symbol: 'AAPL' },
  { title: 'Google', symbol: 'GOOG' },
  { title: 'Microsoft', symbol: 'MSFT' },
  { title: 'Amazon', symbol: 'AMZN' },
  { title: 'Tesla', symbol: 'TSLA' },
  { title: 'Facebook', symbol: 'FB' },
  { title: 'Twitter', symbol: 'TWTR' },
  { title: 'NVIDIA', symbol: 'NVDA' },
  { title: 'AMD', symbol: 'AMD' },
  { title: 'Intel', symbol: 'INTC' },
]

