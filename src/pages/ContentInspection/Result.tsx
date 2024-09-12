import React from 'react'

export const Result = () => {
  return (
    <div className='flexcolumn'>
        <div className='Resultbox2'>
            <div className='fixedboxmotor'>
                Please add details above to show results
            </div>
            <div className='flexcolumn'>
                <button className='selectionbutton fixedbox5' style={{borderColor: "#D2D5D6", borderWidth: "1px", borderStyle: "solid"}}>
                    <img src='icons/Icon_5_Refresh.svg'/>
                    Re-generate
                </button>
            </div>
        </div>
    </div>
  )
}
