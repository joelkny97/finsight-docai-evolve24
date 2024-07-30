import React, { useEffect, useState } from 'react';
// import './App.css';
import NewsLoadingComponent from './NewsLoading';
import News from './News';

function myNews() {
  const NewsLoading = NewsLoadingComponent(News);
  const [appState, setAppState] = useState({
    loading: false,
    news: null
  });

  useEffect(() => {
    setAppState({ loading: true, news: null });
    fetch("http://127.0.0.1:8000/newsapi/")
      .then(res => res.json())
      .then(data => {
        setAppState({ loading: false, news: data });
      });
  }, [setAppState]);
  return (

      
      <div className="myNews">
        <h1>Finsight</h1>
        <NewsLoading isloading={appState.loading} news={appState.news} />
      </div>
  )
  
}

export default myNews;