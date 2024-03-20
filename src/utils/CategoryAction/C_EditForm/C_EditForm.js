import React, { useEffect, useState } from "react";
import CategoryAPI from "../../../apis/Category/CategoryAPI";
import "./C_EditForm.scss";
import SubCategoryAPI from "../../../apis/SubCategoryAPI/SubCategoryAPI";
import LoadingSM from "../../../assets/images/loading_sm.gif";

const C_EditForm = ({ onFinish, active, data }) => {
  const [category, setCategory] = useState({});
  const [subCateEdit, setSubCateEdit] = useState({
    _id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  const [subCateUpdate, setSubCateUpdate] = useState({});
  const [subCateEditMode, setSubCateEditMode] = useState(false);

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

  // Handle Form Cancel
  const onCancel = () => {};

  // Handle Form save
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

  // Reset State data
  const dataReset = () => {
    setCategory({});
  };

  // Handle create sub-category
  const onCreateSubCate = async () => {
    if (!isLoadingCreate) {
      var newSubCate = {
        Name: "New",
      };
      setIsLoadingCreate(true);
      var Create_SubCategory_Result = await SubCategoryAPI.create(newSubCate);
      if (Create_SubCategory_Result.success) {
        var subCateList = category.SubCategory.map((subCate) => subCate._id);
        subCateList.push(Create_SubCategory_Result.data._id);

        var Update_Category_SubCategory_Result = await CategoryAPI.update(
          data._id,
          { SubCategory: subCateList }
        );
        if (Update_Category_SubCategory_Result.success) {
          var newCategoryData = category;
          newCategoryData.SubCategory.push(Create_SubCategory_Result.data);
          setTimeout(() => {
            setCategory({ ...newCategoryData });
            setIsLoadingCreate(false);
          }, 500);
        }
      }
    }
  };

  // Hanle sub-category edit clicked
  const onEditSubCate = (subCate, event) => {
    // Adding class active for sub-category
    const subCateElem = document.querySelector(`.sub-cate-${subCate._id}`);
    subCateElem.classList.add("sub-cate-input-active");
    setSubCateEdit(subCate);
    setSubCateEditMode(true);
  };

  // Handle save edit sub-cate
  const onSaveSubCate = async (subCate, event) => {
    // Update Sub-category here-----------
    var updateSubCateIdx = category.SubCategory.findIndex(
      (sc) => sc._id === subCate._id
    );

    var Update_SubCategory_Result = await SubCategoryAPI.update(subCate._id, category.SubCategory[updateSubCateIdx])
    if(Update_SubCategory_Result.success) {
        console.log(Update_SubCategory_Result)
    }

    //------------------------------------

    // Adding class active for sub-category
    const subCateElem = document.querySelector(`.sub-cate-input-active`);
    subCateElem.classList.remove("sub-cate-input-active");
    setSubCateEdit({
      _id: "",
    });
    setSubCateEditMode(false);
  };

  const onDeleteSubCate = async (subCate, event) => {
    setIsLoading(true);
    const Delete_SubCategory_Result = await SubCategoryAPI.delete([
      subCate._id,
    ]);

    if (Delete_SubCategory_Result.success) {
      var newCategoryData = category;
      newCategoryData.SubCategory = category.SubCategory.filter(
        (item) => item._id !== subCate._id
      );

      var Update_Category_SubCategory_Result = await CategoryAPI.update(
        data._id,
        { SubCategory: newCategoryData.SubCategory }
      );
      if (Update_Category_SubCategory_Result.success) {
        setTimeout(() => {
          setCategory({ ...newCategoryData });
          setIsLoading(false);
        }, 500);
      }
    }
  };

  const onSubCateChange = async (subCate, event) => {
    var updateSubCateIdx = category.SubCategory.findIndex(
      (sc) => sc._id === subCate._id
    );
    var newCate = category;
    newCate.SubCategory[updateSubCateIdx].Name = event.target.value;
    setCategory({ ...category, newCate });
  };

  return (
    <div className="C_EditForm">
      <div className="form-container">
        {!active ? (
          <></>
        ) : (
          <div>
            <div className="flex-row">
              <div className="field-input flex-100">
                <p>Name</p>
                <input
                  type="text"
                  name="Name"
                  onChange={handleChange}
                  value={category.Name}
                ></input>
              </div>
              <div className="field-input flex-100">
                <div className="field-title">
                  <p>[ Sub-Category ]</p>
                  <div className="sub-cate-create" onClick={onCreateSubCate}>
                    {isLoadingCreate ? (
                      <img src={LoadingSM} />
                    ) : (
                      <i class="bi bi-plus-lg"></i>
                    )}
                  </div>
                </div>

                <div className="sub-category-list">
                  {category.SubCategory &&
                    category.SubCategory.map((subCate, index) => {
                      return (
                        <div
                          className={
                            "sub-cate " +
                            (subCateEditMode && subCateEdit._id !== subCate._id
                              ? "sub-cate-disabled "
                              : "") +
                            (subCateEditMode && subCateEdit._id === subCate._id
                              ? "sub-cate-enabled "
                              : "")
                          }
                          key={"sub-category-render-" + subCate._id}
                        >
                          <input
                            className={
                              "sub-cate-input " + `sub-cate-${subCate._id}`
                            }
                            value={subCate.Name}
                            onChange={(event) =>
                              onSubCateChange(subCate, event)
                            }
                            readOnly={
                              !(subCateEdit && subCateEdit._id === subCate._id)
                            }
                          ></input>

                          <div className="actions">
                            {subCateEdit._id !== subCate._id &&
                              !subCateEditMode && (
                                <>
                                  <i
                                    class="bi bi-pencil-fill"
                                    onClick={(event) =>
                                      onEditSubCate(subCate, event)
                                    }
                                  ></i>
                                  <div
                                    className="sub-cate-delete"
                                    onClick={(event) =>
                                      onDeleteSubCate(subCate, event)
                                    }
                                  >
                                    {isLoading ? (
                                      <img src={LoadingSM} />
                                    ) : (
                                      <i class="bi bi-x-lg"></i>
                                    )}
                                  </div>
                                </>
                              )}
                            {subCateEdit && subCateEdit._id === subCate._id && (
                              <i
                                class="bi bi-check2 sub-cate-save"
                                onClick={(event) =>
                                  onSaveSubCate(subCate, event)
                                }
                              ></i>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
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
