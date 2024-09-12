import React, { useEffect, useState } from 'react'
import './Style.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';


export const ProblemMenu = () => {
  const dispatch = useDispatch();

  let navigate = useNavigate(); 
  
  const selectedOption = useSelector((state: { selectedOption: any; }) => state.selectedOption);


  const handleOptionClick = (option: any) => {
    dispatch({ type: 'SET_SELECTED_OPTION', payload: option });
  };

  const handleButtonClick = (option: any) => {
    handleOptionClick(option);
  };

  useEffect(( )=> {
    navigate(`/${selectedOption}`);
  }, [selectedOption, navigate])

  return (
      <div >
        {(
          <div className="itembox problembox fixedbox2">
            <button
            className={`${
              selectedOption === "motor" ? "selectedItem2" : "item2"
            }`}
            onClick={() => {handleButtonClick("motor");}}
          >
            Motor Mapping
          </button>
          <button
            className={`${
              selectedOption === "poster" ? "selectedItem2" : "item2"
            }`}
            onClick={() => {handleButtonClick("poster"); }}
          >
            Poster Generation
          </button>
          <button
            className={`${
              selectedOption === "content" ? "selectedItem2" : "item2"
            }`}
            onClick={() => {handleButtonClick("content");}}
          >
            Content Inspector
          </button>
          <button
            className={`${
              selectedOption === "summary" ? "selectedItem2" : "item2"
            }`}
            onClick={() => {handleButtonClick("summary");}}
          >
            Summarization
          </button>
          {/* <button
            className={`${selectedOption === "qa" ? "selectedItem2" : "item2"}`}
            onClick={() => handleOptionClick("qa")}
          >
            Q&A Chatbot
          </button> */}
        </div>
        )}
      </div>
)}
