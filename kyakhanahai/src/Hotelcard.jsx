import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import parse from "html-react-parser"; // Import parse

export default function Hotelcard({ name, rating, htmlAttributions }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
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
                <span>{parse(attr)}</span>
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
