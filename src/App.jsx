

import { useState } from 'react';
import AppRouter from './routes/AppRouter';
import {  QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/lib";
import { SearchProvider } from './components/SearchContext';

function App() {
  const [loading, setLoading] = useState(true);



return (

     <QueryClientProvider client={queryClient}>
      <SearchProvider>
      <AppRouter />
      </SearchProvider>
           
         </QueryClientProvider>




)
}

export default App
