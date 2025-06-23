
import Cookies from 'js-cookie';
export const getActiveOutlet = () => {
    const selectedOutlet = Cookies.get('userActiveOutlet');
    
    if (!selectedOutlet) {
     
      return null;
    }

 
    
    // Ensure we always return a string
    const outletValue = String(selectedOutlet).trim();

    
    return outletValue;
  };