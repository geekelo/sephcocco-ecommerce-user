
import Cookies from 'js-cookie';
export const getActiveUser = () => {
    const selectedUser = localStorage.getItem('userId');
    
    if (!selectedUser) {
      console.warn('No active user');
      return null;
    }
    
    // Ensure we always return a string
    const user = String(selectedUser).trim();
 
    
    return user;
  };