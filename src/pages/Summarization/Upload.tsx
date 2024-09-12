import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Loader from "../../components/Loader";

export const Upload = () => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [summaryData, setSummaryData] = useState<any>();

  const [setData, allowSetData] = useState<boolean>(false);

  const onDrop = (acceptedFiles: any) => {
    console.log(acceptedFiles);
    setLoading(true);
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    
    axios
      .post("http://localhost:8000/get_summary/", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        },
        cancelToken: source.token,
      })
      .then((response) => {
        console.log(response.data);
        setSummaryData(response.data.bitsized);
        setUploadedFiles([...uploadedFiles, file]);
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Upload canceled");
        } else {
          console.error(error);
          alert(error);
        }
        setLoading(false);
      });

    const cancelUpload = () => {
      source.cancel("Upload cancelled by user");
    };

    file.cancelUpload = cancelUpload;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const handleSubmit = () => {
    console.log("clicked");
  };

  // useEffect(() => {
  //   console.log(summaryData);
  //   setLoading(false);
  // },[summaryData]);

  return (
    <div className="flexcolumn">
      <div className="UploadBox1">
        <div className="box1">
          <img src="icons/Upload_File.svg" />
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>Upload File</p>
          Please only upload .PDF file format
        </div>
        <div className="box2">
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
          >
            <input {...getInputProps({ accept: "application/pdf" })} />
            {isDragActive ? (
              <p>Drop the PDF file here...</p>
            ) : (
              <>
                <p>Drag and drop your file here, or</p>
                <p
                  style={{
                    color: "blue",
                    textDecorationLine: "underline",
                    cursor: "pointer",
                  }}
                >
                  browse
                </p>
              </>
            )}
          </div>
        </div>
        {uploadProgress > 0 && (
          <div className="box3">
            <>
              <img src="icons/File.svg" />
              name.pdf
              <div className="progress-container">
                <progress
                  className="progress-bar"
                  value="{uploadProgress}%"
                  max="100"
                ></progress>
              </div>
              {/* <img src="icons/Cross.svg" alt="Cancel" onClick={file.cancelUpload}/> */}
            </>
          </div>
        )}
        {/* <div className="summaryButton">
          <button onClick={handleSubmit}>Generate Summary</button>
        </div> */}
      </div>
      <div className="UploadBox2">
        {loading ? (
          <Loader />
        ) : (
          <div className="InfoCard">
            {/* Click “Generate summary” to download PDF */}

            {summaryData &&
              <div>
              <div style={{fontWeight: "bold", fontSize: "32px"}}>Summary</div>
              <div className="flexcolumn" style={{margin: "20px"}}>
                <div className="flexrow" style={{marginBottom: "10px"}}>
                  <div className="ques">{`${summaryData.general_summary.question}`}</div>
                  <div className="ans">{`${summaryData.general_summary.answer}`}</div>
                </div>
                <div className="flexrow" style={{marginBottom: "10px"}}>
                  <div className="ques">{`${summaryData.policy_benefits.question}`}</div>
                  <div className="ans">{`${summaryData.policy_benefits.answer}`}</div>
                </div>
                <div className="flexrow" style={{marginBottom: "10px"}}>
                  <div className="ques">{`${summaryData.policy_coverage.question}`}</div>
                  <div className="ans">{`${summaryData.policy_coverage.answer}`}</div>
                </div>
                <div className="flexrow" style={{marginBottom: "10px"}}>
                  <div className="ques">{`${summaryData.policy_duration.question}`}</div>
                  <div className="ans">{`${summaryData.policy_duration.answer}`}</div>
                </div>
                <div className="flexrow" style={{marginBottom: "10px"}}>
                  <div className="ques">{`${summaryData.policy_flexi.question}`}</div>
                  <div className="ans">{`${summaryData.policy_flexi.answer}`}</div>
                </div>
                <div className="flexrow" style={{marginBottom: "10px"}}>
                  <div className="ques">{`${summaryData.policy_limit.question}`}</div>
                  <div className="ans">{`${summaryData.policy_limit.answer}`}</div>
                </div>
                <div className="flexrow" style={{marginBottom: "10px"}}>
                  <div className="ques">{`${summaryData.policy_med_ex.question}`}</div>
                  <div className="ans">{`${summaryData.policy_med_ex.answer}`}</div>
                </div>
                <div className="flexrow" style={{marginBottom: "10px"}}>
                  <div className="ques">{`${summaryData.policy_net.question}`}</div>
                  <div className="ans">{`${summaryData.policy_net.answer}`}</div>
                </div>
                <div className="flexrow" style={{marginBottom: "10px"}}>
                  <div className="ques">{`${summaryData.policy_premium.question}`}</div>
                  <div className="ans">{`${summaryData.policy_premium.answer}`}</div>
                </div>
                <div className="flexrow" style={{marginBottom: "10px"}}>
                  <div className="ques">{`${summaryData.policy_type.question}`}</div>
                  <div className="ans">{`${summaryData.policy_type.answer}`}</div>
                </div>
              </div>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};
