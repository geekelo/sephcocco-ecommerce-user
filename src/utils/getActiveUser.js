
import Cookies from 'js-cookie';
export const getActiveUser = () => {
    const selectedUser = Cookies.get('userId');
    
    if (!selectedUser) {
      console.warn('No active user found in cookies');
      return null;
    }
    
    // Ensure we always return a string
    const user = String(selectedUser).trim();
 
    
    return user;
  };