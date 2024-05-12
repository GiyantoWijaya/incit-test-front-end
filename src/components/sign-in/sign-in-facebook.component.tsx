import React from 'react';
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login';
const APP_ID = process.env.FACEBOOK_APP_ID ? process.env.FACEBOOK_APP_ID : "1396055034428650"

function FacebookAuth() {
  const responseFacebook = (response: ReactFacebookLoginInfo) => {
    console.log(response);
  };

  return (
    <div>
      <FacebookLogin
        appId={APP_ID}
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
      />
    </div>
  );
}

export default FacebookAuth;