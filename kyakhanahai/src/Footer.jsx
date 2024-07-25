import React from "react";
import "./index.css";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  return (
    <div className="border-t border-gray-500 h-40 bg-white text-white flex flex-col justify-center items-center transition-all duration-150 w-full fixed bottom-0 opacity-100  ">
      <ul>
        <li>
          <a
            href="https://www.linkedin.com/in/kashyapsolanki2210/"
            target="_blank"
            rel="noopener noreferrer"
            className={"text-black "}
          >
            <LinkedInIcon className={"text-black"} color="secondary" />
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Kashyap2210?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className={"text-black "}
          >
            <GitHubIcon className={"text-black "} color="secondary" />
            Github
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/kash_codes_/?igsh=MTI4ZXY2OGFwOWFhNw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className={"text-black "}
          >
            <InstagramIcon className={"text-black "} color="secondary" />
            Instagram
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/channel/UCC7_EltJMddOsGmANSxShCw"
            target="_blank"
            rel="noopener noreferrer"
            className={"text-black "}
          >
            <YouTubeIcon className={"text-black "} color="secondary" />
            Youtube
          </a>
        </li>
      </ul>

      <div className={"mt-2 text-black"}>
        Portfolio Website Of Kashyap Solanki Made Using REACT, TAILWIND,
        MATERIAL UI
      </div>
    </div>
  );
}
