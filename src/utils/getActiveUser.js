

export const getActiveUser = () => {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  return {
    id: userId,
    role: userRole,
    email: userEmail,
    name: userName,
    token: token,
    isAdmin: userRole === 'admin',
    isUser: userRole === 'user'
  };
};