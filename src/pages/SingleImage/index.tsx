import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import saveAs from 'file-saver';

export const SingleImage = () => {

  const divRef = useRef(null);
  const [name, setName] = useState("Sender's Name here");
  const [text, setText] = useState("Greetings here");
  const [remarks, setRemarks] = useState("Sender's designation/remarks here");
  const [mobileNo, setMobileNo] = useState("Mobile Number here");

  const handleChange = (event: any) => {
    setName(event.target.value);
  };
  const handleChange1 = (event: any) => {
    setText(event.target.value);
  };
  const handleChange2 = (event: any) => {
    setRemarks(event.target.value);
  };
  const handleChange3 = (event: any) => {
    setMobileNo(event.target.value);
  };

  const handleDownloadClick = () => {
    divRef.current &&
      html2canvas(divRef.current)
        .then((canvas) => {
          canvas.toBlob(function (blob) {
            if (blob) {
              saveAs(blob, 'Poster.png');
            }
          });
        });
  };

  const handleShareClick = () => {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(''), 'facebook-share-dialog', 'width=626,height=436');
  }

  const { festival, id } = useParams();
  const index = id ? parseInt(id) : 1;

  useEffect(() => {
    console.log(`images/PosterGeneration/${festival}/${index}.jpg`);
  }, []);

  return (
    <div className="SuperContainer">
      <div className="ImageContainer">
        <div className="left" ref={divRef}>
          <div className="watermarked">
          <img
            src={`${process.env.PUBLIC_URL}/images/PosterGeneration/${festival}/${index}.jpg`}
            alt={`${festival} ${index}`}
            className="ImageImage"
            />
          <div className="greenBox">
            {`${text}`}
            <div>
              {`${name}`} |{` ${remarks}`}
            </div>
            {`${mobileNo}`}
            </div>
          </div>
        </div>
        <div className="right">
          <form>
            <div className="headerText1">Add Text (Max 20 Char)</div>
            <input
              className="formInput"
              value={text}
              placeholder={"Enter Text"}
              onChange={handleChange1}
            />
            {/* <button className="formButton" onClick={handleChange1}>
              Apply
            </button> */}
            <div className="headerText1">Enter Sender's Name</div>
            <input
              className="formInput"
              value={name}
              placeholder={"Enter Name"}
              onChange={handleChange}
            />
            {/* <button className="formButton" onClick={handleChange}>
              Apply
            </button> */}
            <div className="headerText1">Enter Sender's Remarks</div>
            <input
              className="formInput"
              value={remarks}
              placeholder={"Enter Remarks"}
              onChange={handleChange2}
            />
            {/* <button className="formButton" onClick={handleChange2}>
              Apply
            </button> */}
            <div className="headerText1">Enter Sender's Mobile Number</div>
            <input
              className="formInput"
              value={mobileNo}
              placeholder={"Enter Remarks"}
              onChange={handleChange3}
            />
            {/* <button className="formButton" onClick={handleChange3}>
              Apply
            </button> */}
          </form>
          <div>
            <button
              className="formEndButtons"
              style={{
                color: "white",
                backgroundColor: "black",
                marginRight: "16px",
              }}
              onClick={handleDownloadClick}
            >
              Download
            </button>
            <button
              className="formEndButtons"
              style={{ color: "black", backgroundColor: "white" }}
              onClick={handleShareClick}
            >
              Share on Facebook
            </button>
          </div>
        </div>
      </div>
    </div>

    //       <form>
    //         <div
    //           style={{
    //             height: "100%",
    //             display: "flex",
    //             flexDirection: "column",
    //             justifyContent: "space-between",
    //           }}
    //         >
    //
    //
    //               </div>
    //             </div>
    //           </div>
    //           <div className="flexrow">
    //             <button
    //               className="formEndButtons"
    //               style={{
    //                 color: "white",
    //                 backgroundColor: "black",
    //                 marginRight: "16px",
    //               }}
    //             >
    //               Download
    //             </button>
    //             <button
    //               className="formEndButtons"
    //               style={{ color: "black", backgroundColor: "white" }}
    //             >
    //               Share on Facebook
    //             </button>
    //           </div>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </div>
  );
};
