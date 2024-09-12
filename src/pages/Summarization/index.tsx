import React from 'react'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { ProblemMenu } from '../../components/ProblemMenu'
import { Upload } from './Upload'

export const Summarization = () => {
  return (
    <div className='topbox'>
      <Header />
      <ProblemMenu />
      <div className='fixedbox6'>
        <Upload />
      </div>
      <Footer />
    </div>
  )
}
