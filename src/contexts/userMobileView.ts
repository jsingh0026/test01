import React from 'react';

export const UserContext = React.createContext({
    view: true,
    setView: (view:boolean)=>null
  });

