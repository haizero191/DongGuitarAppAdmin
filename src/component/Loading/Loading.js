import React from 'react'
import LoadingIcon from "../../assets/images/loading_icon.gif"
import "./Loading.scss"

const Loading = ({isLoading = false}) => {
  return (
    <div className='Loading'> 
        {
            isLoading ?
            <div className='loading-container'>
                <div className='loading-icon'>
                    <img src={LoadingIcon} alt="My GIF" />
                </div> 
            </div>
            :
            <></>
        }
    </div>
  )
}

export default Loading