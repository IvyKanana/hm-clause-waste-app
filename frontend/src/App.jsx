import React from 'react'
import Header from './components/Header'
import Form from './components/Form'

export default function App(){
  return (
    <div className="app-root">
      <Header />
      <main>
        <Form />
      </main>
    </div>
  )
}
