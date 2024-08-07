// This is the 1st component on the home page

import "./index.css";

export default function Firstintrocomp() {
  return (
    <div className=" flex items-center justify-between ">
      <p className="w-1/2">
        Welcome to kyakhanahai.com! We help you answer one of the most difficult
        question... <i>KHANEY MAI KYA BANAU?</i>
      </p>
      <img src="intro_pic.jpg" alt="" className="w-1/2 main-content" />
    </div>
  );
}
