import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Box, Paper } from '@mui/material';
import axiosInstance from '../Axios.tsx';

interface Stock {
  title: string;
  symbol: string;
}

interface StockSearchBarProps {
  onSearchSubmit: (query: string) => void; // New prop for handling search submission
}

const topStocks: Stock[] = [
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
];

export default function StockSearchBar({ onSearchSubmit }: StockSearchBarProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Stock[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [selectedStock, setSelectedStock] = React.useState<Stock | null>(null);

  const handleInputChange = (event: React.SyntheticEvent<Element, Event>, value: string) => {
    setInputValue(value);
    if (value) {
      console.log(value);
    } else {
      setOptions([]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setOptions(topStocks);
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedStock) {
      // Pass the selected stock title to the parent component
      onSearchSubmit(selectedStock.title);
    }
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
          onClose={handleClose}
          options={topStocks.map((option) => option.title)}
          onInputChange={handleInputChange}
          onChange={(event: React.SyntheticEvent, newValue: string | null) => {
            const selected = topStocks.find(stock => stock.title === newValue);
            setSelectedStock(selected || null);
          }}
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
