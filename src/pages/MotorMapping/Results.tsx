import React, { useState } from 'react'

export const Results = (assignedCluster: string[]) => {
    const [inputValues, setInputValues] = useState({
        make: "",
        model: "",
        variant: "",
        fuel: "",
        cc: "",
        transmission: "",
        seating: ""
      });

  return (
    <div className='contentbox'>
        <div className='fixedboxmotor'>
            {/* <div>
                Please add details above to show results
            </div> */}
        </div>
        <div className='motorresult'>
            <div className='horizontalcard'>
                <div className='motorcard'>
                    <div className='dataitem'>
                        <div className='headerText'>Insurer</div>
                        <div>Digit</div>
                    </div>
                    <div className='motordetailcard'>
                        <div className='dataitem'>
                            <div className='headerText'>Variant</div>
                            <div>Petrol</div>
                        </div>
                        <div className='dataitem'>
                            <div className='headerText'>Cubic Power</div>
                            <div>1200</div>
                        </div>
                        <div className='dataitem'>
                            <div className='headerText'>Seating</div>
                            <div>5</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
