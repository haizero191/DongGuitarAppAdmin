import React, { useEffect, useState } from "react";
import "./Tags_M.scss";
import Category_M from "../Category_M/Category_M";
import Brand_M from "../Brand_M/Brand_M";
import Featured_M from "../Featured_M/Featured_M";
import Loading from "../Loading/Loading";

const Tags_M = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoadedList, setDataLoadedList] = useState([
    {
      name: "category",
      isLoaded: false,
    },
    {
      name: "brand",
      isLoaded: false,
    },
    {
      name: "product-feature",
      isLoaded: false,
    },
  ]);

  useEffect(() => {
    var isLoadingAll = dataLoadedList.filter(dataLoaded => {return dataLoaded.isLoaded === false})
    if(isLoadingAll.length > 0) {
      setIsLoading(true)
    }
    else {
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  });


  // Listen data loaded
  const onFormDataLoaded = (data) => {
    switch (data.name) {
      case "category":
        if (data.isLoaded) {
          setDataLoadedList(dataLoaded => 
            dataLoaded.map((obj) => (obj.name === data.name ? { ...obj, isLoaded: data.isLoaded } : obj))
          );
        }
        break;
      // case "brand":
      //   if (data.isLoaded) {
      //      setDataLoadedList(dataLoaded => 
      //       dataLoaded.map((obj) => (obj.name === data.name ? { ...obj, isLoaded: data.isLoaded } : obj))
      //     );
      //   }
      //   break;
      // case "product-feature":
      //   if (data.isLoaded) {
      //      setDataLoadedList(dataLoaded => 
      //       dataLoaded.map((obj) => (obj.name === data.name ? { ...obj, isLoaded: data.isLoaded } : obj))
      //     );
      //   }
      //   break;
      default:
        break;
    }
  };

  return (
    <div className="Tags_M">
      {/* {
        isLoading ? <div className="loading-bg"><Loading isLoading={isLoading} /></div> : <></>
      } */}
      <div className="TM-left">
        <div className="Category-M">
          <Category_M onLoad={onFormDataLoaded} />
        </div>
        {/* <div className="Brand-M">
          <Brand_M onLoad={onFormDataLoaded} />
        </div> */}
      </div>
      <div className="TM-right">
        {/* <Featured_M onLoad={onFormDataLoaded} /> */}
      </div>
    </div>
  );
};

export default Tags_M;
