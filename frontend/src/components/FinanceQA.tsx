import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Grid } from '@mui/material';
import axiosInstance from '../Axios';
import AppAppBar from './AppAppBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import getLPTheme from './getLPTheme';
import Divider from '@mui/material/Divider';

const FinanceQA: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [mode, setMode] = React.useState<PaletteMode>('dark');
    const [showCustomTheme, setShowCustomTheme] = React.useState(false);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });

    const toggleColorMode = () => {
        setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

    React.useEffect(() => {
        setMode('dark');

    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file || !question) {
            setError('Please provide both a PDF file and a question.');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('question', question);

        try {
            const response = await axiosInstance.post('/api/finance/financeqa/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAnswer(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred while processing your request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>

            <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
            <Divider />
                <Typography variant="h4" align="center" gutterBottom>
                    Finance Q&A
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                required
                                style={{ display: 'none' }}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload">
                                <Button variant="contained" component="span" fullWidth>
                                    Upload PDF
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Ask your question..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" fullWidth disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {error && <Typography color="error" align="center" sx={{ marginTop: 2 }}>{error}</Typography>}
                {answer && (
                    <div style={{ marginTop: 2 }}>
                        <Typography variant="h6">Answer:</Typography>
                        <pre>{JSON.stringify(answer, null, 2)}</pre>
                    </div>
                )}
            </Paper>
        </Container>
    );
};

export default FinanceQA;
