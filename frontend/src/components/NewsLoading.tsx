import React from "react";
import { Component } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function NewsLoading(WrappedComponent: any) {
    return function NewsLoadingComponent({ isLoading, ...props }: any) {
        if (!isLoading) {
            return <WrappedComponent {...props} />;
        }
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress size={60} />
            </Box>
        );
    }
}

export default NewsLoading;
