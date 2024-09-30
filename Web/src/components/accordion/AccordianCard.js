import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function AccordianCard({ getCourseFaq }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <div>
      {getCourseFaq?.map((faq) => {
        return (
          <Accordion
            sx={{ backgroundColor: "#FEF4D8", borderRadius: "4px", mb: 2 }}
          >
            <AccordionSummary
              expandIcon={
                <KeyboardArrowDownIcon
                  sx={{
                    color: "#fff",
                    backgroundColor: "#f26b35",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                  }}
                />
              }
              aria-controls="panel2-content"
              id="panel2-header"
              sx={{ backgroundColor: "#FEF4D8", borderRadius: "4px" }}
            >
              <Typography sx={{ fontWeight: "600" }}>
                {faq?.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{ backgroundColor: "#FEF4D8", borderRadius: "4px" }}
            >
              <Typography>{faq?.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/*<Accordion
        sx={{ backgroundColor: "#FEF4D8", borderRadius: "4px", mb: 2 }}
      >
        <AccordionSummary
          expandIcon={
            <KeyboardArrowDownIcon
              sx={{
                color: "#fff",
                backgroundColor: "#f26b35",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
              }}
            />
          }
          aria-controls="panel2-content"
          id="panel2-header"
          sx={{ backgroundColor: "#FEF4D8", borderRadius: "4px" }}
        >
          <Typography sx={{ fontWeight: "600" }}>
            Default transition using Collapse
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ backgroundColor: "#FEF4D8", borderRadius: "4px" }}
        >
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{ backgroundColor: "#FEF4D8", borderRadius: "4px", mb: 2 }}
      >
        <AccordionSummary
          expandIcon={
            <KeyboardArrowDownIcon
              sx={{
                color: "#fff",
                backgroundColor: "#f26b35",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
              }}
            />
          }
          aria-controls="panel2-content"
          id="panel2-header"
          sx={{ backgroundColor: "#FEF4D8", borderRadius: "4px" }}
        >
          <Typography sx={{ fontWeight: "600" }}>
            Default transition using Collapse
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ backgroundColor: "#FEF4D8", borderRadius: "4px" }}
        >
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion> */}
    </div>
  );
}
