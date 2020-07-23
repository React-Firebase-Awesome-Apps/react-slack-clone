import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ uploadState, percentUploaded }) => {
    console.log('progressBar', uploadState, percentUploaded);
    
  return (
    uploadState === 'uploading' && (
      <Progress
        className="progress__bar"
        percent={percentUploaded}
        progress
        indicating
        size="medium"
        inverted
        success
      />
    )
  );
};

export default ProgressBar;
