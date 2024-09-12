import React, { useState } from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MotorMapping } from './pages/MotorMapping';
import { PosterGeneration } from './pages/PosterGeneration';
import { ContentInspection } from './pages/ContentInspection';
import { Summarization } from './pages/Summarization';
import { QAChatbot } from './pages/QAChatbot';
import { Provider } from 'react-redux';
import store from './store';
import { SingleImage } from './pages/SingleImage';


function App() {
  return (
    <div className="App">
      <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MotorMapping />} />
          <Route path="/motor" element={<MotorMapping />} />
          <Route path="/poster" element={<PosterGeneration />} />
          <Route path="/poster/:festival/:id" element={<SingleImage />} />
          <Route path="/content" element={<ContentInspection />} />
          <Route path="/summary" element={<Summarization />} />
          {/* <Route path="/qna-chatbot" element={<QAChatbot />} /> */}
        </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
