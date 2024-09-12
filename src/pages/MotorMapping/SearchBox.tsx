import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
import { Results } from './Results';

export const SearchBox = () => {

  const [inputValues, setInputValues] = useState({
    make: "",
    model: "",
    variant: "",
    fuel: "",
    cc: "",
  });
  const [variants, setVariants] = useState<string[]>([]);
  const [fuels, setFuels] = useState<string[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [ccs, setCcs] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [assignedCluster, setAssignedCluster] = useState<any>([]);
  const [resultLoading, setResultLoading] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setAssignedCluster([]);
    setResultLoading(false);
    setLoading(true);
    event.preventDefault();
    axios
      .post("http://localhost:8000/get_cars/", inputValues)
      .then((res: AxiosResponse) => {
        if (!res.data.message) {
          setAssignedCluster(res.data.all_cars);
        } else {
          alert(res.data.message);
        }
        //  console.log(res)
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/get_makes")
      .then((res: AxiosResponse) => setMakes(res.data.all_makes))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    console.log(assignedCluster);
  }, [assignedCluster]);

  const handleInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [event.target.name]: event.target.value,
    }));

    if (event.target.name === "make") {
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        model: "",
        variant: "",
        fuel: "",
      }));

      axios
        .get(`http://localhost:8000/get_models/${event.target.value}`)
        .then((res: AxiosResponse) => setModels(res.data.all_models))
        .catch((error) => console.log(error));
    }

    if (event.target.name === "model") {
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        variant: "",
        fuel: "",
        cc: "",
      }));

      axios
        .get(
          `http://localhost:8000/get_fuels/${inputValues.make}/${event.target.value}/`
        )
        .then((res: AxiosResponse) => setFuels(res.data.all_fuels))
        .catch((error) => console.log(error));
    }

    if (event.target.name === "fuel") {
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        cc: "",
        variant: "",
      }));

      axios
        .get(
          `http://localhost:8000/get_ccs/${inputValues.make}/${inputValues.model}/${event.target.value}/`
        )
        .then((res: AxiosResponse) => setCcs(res.data.all_cc))
        .catch((error) => console.log(error));
    }

    if (event.target.name === "cc") {
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        variant: ""
      }));

      axios
        .get(
          `http://localhost:8000/get_variants/${inputValues.make}/${inputValues.model}/${inputValues.fuel}/${event.target.value}/`
        )
        .then((res: AxiosResponse) =>
          setVariants(res.data.all_variants)
        )
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    if (assignedCluster.length > 0) {
      setLoading(false);
      setResultLoading(true);
      console.log(assignedCluster);
    }
  }, [assignedCluster]);


  return (
    <div>
      <div className='searchbox'>
        <div className='flexrow' style={{ height: "100%", width: "100%" }}>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <select
              name="make"
              value={inputValues.make}
              onChange={handleInputChange}
              className="checkbox"
              style={{width: "150px"}}
            >
              <option value="">Select Make</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>

            <select
              name="model"
              value={inputValues.model}
              onChange={handleInputChange}
              className="checkbox"
              style={{width: "170px"}}
            >
              <option value="">Select Model</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>

            {/* <select
                      name="variant"
                      value={inputValues.variant}
                      onChange={handleInputChange}
                      className="w-full py-2 px-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                      <option value="">Select Variant</option>
                      {variants.map((variant) => (
                      <option key={variant} value={variant}>
                          {variant}
                      </option>
                      ))}
                  </select> */}

            <select
              name="fuel"
              value={inputValues.fuel}
              onChange={handleInputChange}
              className="checkbox"
            >
              <option value="">Select Fuel</option>
              {fuels.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>

            <select
              name="cc"
              value={inputValues.cc}
              onChange={handleInputChange}
              className="checkbox"
            >
              <option value="">Select CC</option>
              {ccs.map((cc) => (
                <option key={cc} value={cc}>
                  {cc}
                </option>
              ))}
            </select>

            <select
              name="variant"
              value={inputValues.variant}
              onChange={handleInputChange}
              className="checkbox"
              style={{ width: "300px" }}
            >
              <option value="">Select Variants</option>
              {variants.map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className='motorsubmit'
            // disabled={loading}
            >
              Submit
            </button>
          </form>
          {/* {assignedCluster.length > 0 && (
              <div className="bg-white rounded-md p-4 mt-6 text-center flex flex-col max-h-40 overflow-y-scroll border">
                  {assignedCluster.map((entry) => (
                  <div key={entry}>
                      <p>{entry},</p>
                  </div>
                  ))}
              </div>
              )} */}
          {/* {loading && (
              <div className="bg-red flex m-auto border-red-100 m-12">
                  <ReactLoading type="balls" color="green" height={128} width={128} />
              </div>
              )} */}
        </div>
      </div>
      {resultLoading && assignedCluster.length > 0 &&
        (<div className='contentbox'>
          <div className='fixedboxmotor'>
            {/* <div>
                  Please add details above to show results
              </div> */}
          </div>
          <div className='motorresult'>
            <div className='horizontalcard'>
              <div>{assignedCluster.map((each:any) => <div key={each.variant}>
                <div className='motorcard'>
                  <div className='dataitem'>
                    <div className='headerText'>Insurer</div>
                    <div>{`${each.insurer}`}</div>
                  </div>
                  <div className='motordetailcard'>
                    <div className='dataitem'>
                      <div className='headerText'>Make</div>
                      <div>{`${each.make}`}</div>
                    </div>
                    <div className='dataitem'>
                      <div className='headerText'>Model</div>
                      <div>{`${each.model}`}</div>
                    </div>
                    <div className='dataitem' style={{width: "150px"}}>
                      <div className='headerText' >Variant</div>
                      <div style={{textAlign: "start"}}>{`${each.variant}`}</div>
                    </div>
                    <div className='dataitem'>
                      <div className='headerText'>Fuel</div>
                      <div>{`${each.fuel}`}</div>
                    </div>
                    <div className='dataitem'>
                      <div className='headerText'>Cubic Power</div>
                      <div>{`${each.cc}`}</div>
                    </div>
                    <div className='dataitem'>
                      <div className='headerText'>Seating</div>
                      <div>{`${each.seating}`}</div>
                    </div>
                  </div>
                </div>
              </div>)}</div>
            </div>
          </div>
        </div>)}
    </div>
  )
}


// {(<div className='contentbox'>
//   <div className='fixedboxmotor'>
//       {/* <div>
//           Please add details above to show results
//       </div> */}
//   </div>
//     <div className='motorresult'>
//         <div className='horizontalcard'>
//             <div className='motorcard'>
//                 <div className='dataitem'>
//                     <div className='headerText'>Insurer</div>
//                     <div>Digit</div>
//                 </div>
//                 <div className='motordetailcard'>
//                     <div className='dataitem'>
//                         <div className='headerText'>Variant</div>
//                         <div>Petrol</div>
//                     </div>
//                     <div className='dataitem'>
//                         <div className='headerText'>Cubic Power</div>
//                         <div>1200</div>
//                     </div>
//                     <div className='dataitem'>
//                         <div className='headerText'>Seating</div>
//                         <div>5</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>)}