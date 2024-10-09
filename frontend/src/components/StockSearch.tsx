import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Box, Paper } from '@mui/material';

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
      // Keep options based on the input
      const filteredOptions = topStocks.filter(stock =>
        stock.title.toLowerCase().includes(value.toLowerCase())
      );
      setOptions(filteredOptions);
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
    // Use the input value if it's not empty, otherwise use the selected stock title
    const query = selectedStock ? selectedStock.title : inputValue;
    if (query) {
      onSearchSubmit(query);
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
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          options={options.map((option) => option.title)}
          onInputChange={handleInputChange}
          onChange={(event: React.SyntheticEvent, newValue: string | null) => {
            const selected = topStocks.find(stock => stock.title === newValue);
            setSelectedStock(selected || null);
            setInputValue(newValue || ''); // Update inputValue when an option is selected
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
              value={inputValue} // Control the input value
              onChange={(e) => setInputValue(e.target.value)} // Handle input change
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
