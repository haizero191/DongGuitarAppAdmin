import React from "react";
import "./C_CreateForm.scss";
import { useState } from "react";
import CategoryAPI from "../../../apis/Category/CategoryAPI";

const C_CreateForm = ({ onFinish, active }) => {
  const [category, setCategory] = useState({});

  const handleChange = (event) => {
    setCategory({ ...category, [event.target.name]: event.target.value });
  };
  // cancel form create
  const onCancel = () => {
    onFinish({
      status: "FORM_CANCEL",
    });
    dataReset();
  };

  // Handle save
  const onSave = async () => {
    if (category.Name) {
      var response = await CategoryAPI.create(category);
      if (response.success) {
        onFinish({
          status: "FORM_FINISHED",
        });
        dataReset();
      }
    } else alert("Please fill a information form !!!");
  };

  // Reset data 
  const dataReset = () => {
    setCategory({})
  }
  return (
    <div className="C_CreateForm">
      <div className="form-container">
        {!active ? (
          <></>
        ) : (
          <div>
            <div className="flex-row">
              <div className="field-input flex-70">
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

export default C_CreateForm;
