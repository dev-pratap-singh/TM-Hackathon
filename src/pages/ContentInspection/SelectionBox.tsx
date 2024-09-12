import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader';

export const SelectionBox = () => {
  const [loading, setLoading] = useState(false);
  const [folder, setFolder] = useState('');
  const [name, setName] = useState("");
  const folders = ['damaged-dented-bumper','dented-front-bumper','dented-side-door','scratched-front-bumper','scratched-rear-bumper','scratched-side-door' ]
  const [number, setNumber] = useState((Math.round(Math.random() * 10))
  );
    // const

  const handleSubmit = (event?: any) => {
    setLoading(true);
    if (folders.includes(name)) {
        setFolder(name);
        setNumber((Math.round(Math.random() * 10)));
    }
    setTimeout(() => {
      setLoading(false);
    }, 1300);
  };


    const handleNameChange = (prop:any) => {
        if(prop != name){
            setName(prop);
        }
        else handleSubmit();
    }

    // function toggleColor() {
    //     if (btnClass === 'blue-color') {
    //         setBtnClass('orange-color');
    //     } else {
    //         setBtnClass('blue-color');
    //     }
    // }

    useEffect(() => {
        handleSubmit();
    },[name])
    

  return (
    <div>
        <div className='searchbox'>
            <div className='flexcolumn' style={{height: "100%", width: "100%"}}>
                <div>
                    Please select your damage
                </div>
                <div className='flexrow' style={{marginTop: '10px'}}>
                    <button className='item2 selectionbutton' onClick={() => {handleNameChange("damaged-dented-bumper")}}>
                        <img 
                        src="icons/bumper-damage.svg"
                        />
                        Damaged dented bumper
                    </button>
                    <button className='item2 selectionbutton' onClick={() => {handleNameChange("dented-front-bumper")}}>
                        <img 
                        src="icons/Icon_2_Dent.svg"
                        />
                        Dented front bumper
                    </button>
                    <button className='item2 selectionbutton' onClick={() => {handleNameChange("dented-side-door")}}>
                        <img src="icons/side-door.svg"/>
                        Dented side door
                    </button>
                    <button className='item2 selectionbutton' onClick={() => {handleNameChange("scratched-front-bumper")}}>
                        <img src="icons/back-bumper.svg"/>
                        Scratched front bumper
                    </button>
                    <button className='item2 selectionbutton' onClick={() => {handleNameChange("scratched-rear-bumper")}}>
                        <img src="icons/back-bumper.svg"/>
                        Scratched rear bumper
                    </button>
                    <button className='item2 selectionbutton' onClick={() => {handleNameChange("scratched-side-door")}}>
                        <img src="icons/Icon_3_Scratch.svg"/>
                        Scratched side door
                    </button>
                </div>
            </div>
        </div>
        <div className='flexcolumn'>
            <div className='Resultbox2'>
                <div>
                {loading ? (
                    <Loader />
                ) : folder ? (
                    <div style={{ marginTop: "10px" }}>
                        <img
                        style={{marginTop: "-11px"}}
                        className="Resultbox2"
                        src={`images/Car_Images/${folder}/${number}.jpg`} // Assuming your images are named image1.jpg, image2.jpg, etc.
                        />
                    </div>
                ) : (
                    <p>Please add details above to show results!</p>
                )}
                    
                </div>
                {/* <div className='flexcolumn'>
                    <button className='selectionbutton fixedbox5' style={{borderColor: "#D2D5D6", borderWidth: "1px", borderStyle: "solid"}} onClick={() => {handleSubmit()}}>
                        <img src='icons/Icon_5_Refresh.svg'/>
                        Re-generate
                    </button>
                </div> */}
            </div>
        </div>
    </div>
  )
}