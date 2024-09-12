import React from 'react'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { ProblemMenu } from '../../components/ProblemMenu'
import { PromptGen } from './PromptGen'

export const PosterGeneration = () => {
  return (
    <div className='topbox'>
      <Header />
      <ProblemMenu />
      <div className='fixedbox4'>
        <PromptGen />
      </div>
      <Footer />
    </div>
  )
}
