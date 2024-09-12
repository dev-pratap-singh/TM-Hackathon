import React from 'react'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { ProblemMenu } from '../../components/ProblemMenu'
import { Results } from './Results'
import { SearchBox } from './SearchBox'

export const MotorMapping = () => {
  return (
    <div className='topbox'>
      <Header />
      <ProblemMenu />
      <div className='fixedbox4'>
        <SearchBox />
      </div>
      <Footer />
    </div>
  )
}
