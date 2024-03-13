import React, { useState } from "react";
import "./F_CreateForm.scss";
import BrandAPI from "../../../apis/Brand/BrandAPI";
import FeatureAPI from "../../../apis/Feature/FeatureAPI";

const F_CreateForm = ({ onFinish, active }) => {
  const [feature, setFeature] = useState({});

  const handleChange = (event) => {
    if (event.target.name === "IsActive") {
      setFeature({
        ...feature,
        [event.target.name]: event.target.checked,
      });
    }
    else {
        setFeature({
            ...feature,
            [event.target.name]: event.target.value.toLowerCase(),
          });
    }
  };

  const onCancel = () => {
    onFinish({
      status: "FORM_CANCEL",
    });
    dataReset();
  };
  const onSave = async () => {
    if (feature.Name) {
      var response = await FeatureAPI.create(feature);
      if (response.success) {
        onFinish({
          status: "FORM_FINISHED",
        });
        dataReset();
      }
    } else alert("Please fill a information form !!!");
  };

  const dataReset = () => {
    setFeature({});
  };

  return (
    <div className="F_CreateForm">
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
              <div className="field-input flex-100 show-home">
                <input
                  type="checkbox"
                  name="IsActive"
                  onChange={handleChange}
                ></input>
                <p>Show home</p>
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

export default F_CreateForm;
