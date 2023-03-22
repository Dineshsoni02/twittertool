import React from "react";
import { Toaster } from "react-hot-toast";

import TwitterPage from "./components/twitterpage/TwitterPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Toaster />
      <TwitterPage />
    </div>
  );
}

export default App;
