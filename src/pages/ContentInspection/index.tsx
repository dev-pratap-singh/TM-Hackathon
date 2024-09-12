import React from 'react'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { ProblemMenu } from '../../components/ProblemMenu'
import { Result } from './Result'
import { SelectionBox } from './SelectionBox'

export const ContentInspection = () => {
  return (
    <div className='topbox'>
      <Header />
      <ProblemMenu />
      <div className='fixedbox4'>
        <SelectionBox />
        {/* <Result /> */}
      </div>
      <Footer />
    </div>
  )
}
