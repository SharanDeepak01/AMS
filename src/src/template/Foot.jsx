import { Component } from "react";
import {createRoot} from 'react-dom/client';
import React from "react";

class Foot extends Component{

    render(){
        return (
            <footer className="main-footer">
    <strong>© {new Date().getFullYear()} <a href="/">ACETECH</a>. </strong>
    All rights reserved.
    <div className="float-right d-none d-sm-inline-block">
      <b>Ver </b>2.0
    </div>
  </footer>
        )
    }
}
export default Foot;

// const root = createRoot(document.getElementById('foot'));
// root.render(<Foot/>)