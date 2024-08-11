// This element displays the details of each restaurant in a card form

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import parse from "html-react-parser"; // Import parse this is used to pars html elements in React

export default function Hotelcard({ name, rating, htmlAttributions }) {
  const updateHtmlAttributions = (attribution) => {
    return attribution.replace(
      /<a /g,
      '<a target="_blank" rel="noopener noreferrer" '
    );
  };

  return (
    <Card sx={{ maxWidth: 345, border: "1px solid black", marginTop: "1rem" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Rating: {rating}
        </Typography>
        <div>
          {htmlAttributions && htmlAttributions.length > 0 ? (
            htmlAttributions.map((attr, i) => (
              <div key={i}>
                <span>Click Here For Details:</span>&nbsp;
                <span className="font-bold">
                  {parse(updateHtmlAttributions(attr))}
                </span>
              </div>
            ))
          ) : (
            <p>No photos available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
