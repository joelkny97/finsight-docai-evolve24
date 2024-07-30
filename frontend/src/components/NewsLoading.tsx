import React from "react";
import { Component } from "react";

function NewsLoading(Component: any) {
    return function NewsLoadingComponent({ isLoading, ...props }: any) {
        if (!isLoading) {
            return <Component {...props} />;
        
        return (
            <p style={{ textAlign: 'center', 'fontSize': '20px' }}>
                Loading...
            </p>
        );
        }
    }
}

export default NewsLoading;