


import AppRouter from './routes/AppRouter';
import {  QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/lib";
import { SearchProvider } from './components/SearchContext';

function App() {
 



return (

     <QueryClientProvider client={queryClient}>
      <SearchProvider>
      <AppRouter />
      </SearchProvider>
           
         </QueryClientProvider>




)
}

export default App
