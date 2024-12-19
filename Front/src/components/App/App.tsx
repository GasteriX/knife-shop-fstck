import React, { FC, ReactNode } from 'react';

import Header from "../elements/PageHeader/PageHeader.tsx";

interface AppProps {
   children: ReactNode;
}

const App: FC<AppProps> = ({ children }) => {
   return (
      <>
         <Header></Header>
         <main>{children}</main>
      </>
   );
};
export default App;