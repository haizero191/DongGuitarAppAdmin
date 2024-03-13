import React, { useState } from "react";
import "./B_CreateForm.scss";
import BrandAPI from "../../../apis/Brand/BrandAPI";

const B_CreateForm = ({ onFinish, active }) => {
  const [brand, setBrand] = useState({});

  const handleChange = (event) => {
    setBrand({
      ...brand,
      [event.target.name]: event.target.value.toLowerCase(),
    });
  };
  const onCancel = () => {
    onFinish({
      status: "FORM_CANCEL",
    });
    dataReset();
  };
  const onSave = async () => {
    if (brand.Name) {
      var response = await BrandAPI.create(brand);
      if (response.success) {
        onFinish({
          status: "FORM_FINISHED",
        });
        dataReset();
      }
    } else alert("Please fill a information form !!!");
  };
  const dataReset = () => {
    setBrand({});
  };

  return (
    <div className="B_CreateForm">
      <div className="form-container">
        {!active ? (
          <></>
        ) : (
          <div>
            <div className="flex-row">
              <div className="field-input flex-100">
                <p>Name</p>
                <input type="text" name="Name" onChange={handleChange}></input>
              </div>
            </div>

            <div className="flex-row">
              <div className="btn-final">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onSave}>
                  Save
                  {/* <Loading isLoading={isLoading}></Loading> */}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default B_CreateForm;
