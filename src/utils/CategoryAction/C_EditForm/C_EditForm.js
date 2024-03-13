import React, { useEffect, useState } from "react";
import CategoryAPI from "../../../apis/Category/CategoryAPI";
import "./C_EditForm.scss";

const C_EditForm = ({ onFinish, active, data }) => {
  const [category, setCategory] = useState({});

  useEffect(() => {
    if (!active) {
        dataReset();
    } else {
      setCategory(data);
    }
  }, [active]);

  const handleChange = (event) => {
    setCategory({ ...category, [event.target.name]: event.target.value });
  };
  const onCancel = () => {};

  const onSave = async () => {
    if (category.Name) {
      var response = await CategoryAPI.update(category._id, category);
      if (response.success) {
        onFinish({
          status: "FORM_FINISHED",
        });
        dataReset();
      }
    } else alert("Please fill a information form !!!");
  };

  const dataReset = () => {
    setCategory({});
  };

  return (
    <div className="C_EditForm">
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
                  value={category.Name}
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

export default C_EditForm;
