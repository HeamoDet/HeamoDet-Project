import HomePage from '@/components/home/Home'
import Navbar from '@/components/header/Navbar'
import React from 'react'

export default function page() {
  return (
    <div>
        <Navbar authentication={true}/>
      <HomePage/>
    </div>
  )
}
