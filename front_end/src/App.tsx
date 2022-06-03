import React from 'react';
import {Header} from "./components/Header"
import {Container} from "@material-ui/core"
import {Main} from "./components/Main"

export function App() {
  return (
    <div className="App">
      
      <Header />
      <Container maxWidth={"md"}>

       <Main />
      </Container>
    </div>
  );
}

