import React, { useEffect, useState } from "react";
import BrandAPI from "../../../apis/Brand/BrandAPI";
import "./F_EditForm.scss";
import FeatureAPI from "../../../apis/Feature/FeatureAPI";

const F_EditForm = ({ onFinish, active, data }) => {
  const [feature, setFeature] = useState({});

  useEffect(() => {
    if (!active) {
      dataReset();
    } else {
      setFeature(data);
    }
  }, [active]);

  const handleChange = (event) => {
    if(event.target.name === "IsActive") {
        setFeature({ ...feature, [event.target.name]: event.target.checked });
    }
    else {
        setFeature({ ...feature, [event.target.name]: event.target.value });
    }

  };
  const onCancel = () => {};

  const onSave = async () => {
    if (feature.Name) {
      var response = await FeatureAPI.update(feature._id, feature);
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
    <div className="F_EditForm">
      <div className="form-container">
        {!active ? (
          <></>
        ) : (
          <div>
            <div className="flex-row">
              <div className="field-input flex-70">
                <p>Name</p>
                <input
                  type="text"
                  name="Name"
                  onChange={handleChange}
                  value={feature.Name}
                ></input>
              </div>
            </div>


            <div className="flex-row">
              <div className="field-input flex-100 show-home">
                <input
                  type="checkbox"
                  name="IsActive"
                  onChange={handleChange}
                  checked={feature.IsActive}
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

export default F_EditForm;
