import React, { useEffect, useState } from "react";
import BrandAPI from "../../../apis/Brand/BrandAPI";
import "./B_EditForm.scss";

const B_EditForm = ({ onFinish, active, data }) => {
  const [brand, setBrand] = useState({});

  useEffect(() => {
    if (!active) {
      dataReset();
    } else {
      setBrand(data);
    }
  }, [active]);

  const handleChange = (event) => {
    setBrand({ ...brand, [event.target.name]: event.target.value });
  };
  const onCancel = () => {};

  const onSave = async () => {
    if (brand.Name) {
      var response = await BrandAPI.update(brand._id, brand);
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
    <div className="B_EditForm">
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
                  value={brand.Name}
                ></input>
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

export default B_EditForm;
