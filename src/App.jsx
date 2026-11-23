import React, { useState } from 'react';
import Header from './components/Header.jsx';
import StudyForm from './components/StudyForm.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <StudyForm />
      </main>
      <Footer />
    </div>
  );
}
