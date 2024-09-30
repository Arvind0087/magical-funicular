import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
  Grid,
  useTheme,
  Divider,
  Card,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { getAllFaqsAsync, getTestInstructionAsync } from "../redux/async.api";

const Faqs = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const allFaq = useSelector((state) => state.allFaqs.faqs.data);
  const { testinstruction } = useSelector((state) => state?.test);
  const { getOnlySiteSettingData = {} } = useSelector(
    (state) => state?.getOnlySiteSetting
  );
  // const { helpEmail } = getOnlySiteSettingData;
  const { helpLineNumber, helpEmail } = testinstruction;

  useEffect(() => {
    dispatch(
      getTestInstructionAsync({
        type: "view",
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      getAllFaqsAsync({
        type: "help",
      })
    );
  }, []);

  const handleClick = (value) => {
    if (value === "call") {
      window.open(`tel:+91${helpLineNumber}`);
    }
    if (value === "mail") {
      window.open(`mailto:${helpEmail}`, "_blank");
    }
  };

  return (
    <>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          textAlign: "left",
          ml: 6,
          [theme.breakpoints.down("md")]: {
            ml: 5,
          },
        }}
      >
        {" "}
        Help & FAQs
      </Typography>
      <Card
        sx={{
          marginTop: "20px",
          marginInline: "auto",
          width: "92%",
          maxHeight: "75%",
          p: 3,
          overflow: "hidden",
          [theme.breakpoints.down("md")]: {
            background: "none",
            boxShadow: "none",
            padding: 0,
          },
        }}
      >
        <Box sx={{ pt: 2, width: "100%", height: "39vh", overflowY: "auto" }}>
          {allFaq &&
            allFaq.map((item) => {
              return (
                <Accordion key={item.id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </Box>
      </Card>
      <Grid
        container
        sx={{
          mt: 6,
          justifyContent: "center",
          [theme.breakpoints.down("md")]: {
            paddingInline: "15px",
          },
        }}
      >
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            [theme.breakpoints.down("md")]: {
              textAlign: "center",
            },
          }}
        >
          <Typography variant="h4" component="h4" sx={{}}>
            For More Information
          </Typography>
          <Typography variant="p" sx={{ fontSize: "14px" }}>
            You can reach us from Monday to Sunday - 10:00 AM to 7:00 PM
          </Typography>
        </Grid>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            [theme.breakpoints.down("md")]: {
              flexDirection: "column",
            },
          }}
        >
          <CallRoundedIcon
            sx={{ color: "primary.main", fontSize: "40px", mr: 1 }}
            onClick={() => handleClick("call")}
          />
          Call us at{" "}
          <Typography
            variant="span"
            onClick={() => handleClick("call")}
            sx={{
              color: "primary.main",
              cursor: "pointer",
              pl: 1,
              fontSize: "14px",
            }}
          >
            +91 {helpLineNumber}
          </Typography>
        </Grid>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ pr: 1 }}
        />
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            [theme.breakpoints.down("md")]: {
              flexDirection: "column",
            },
          }}
        >
          <MailOutlineRoundedIcon
            sx={{ color: "primary.main", fontSize: "40px", mr: 1 }}
            onClick={() => handleClick("mail")}
          />
          Mail us at
          <Typography
            variant="span"
            onClick={() => handleClick("mail")}
            sx={{
              color: "primary.main",
              cursor: "pointer",
              pl: 1,
              fontSize: "14px",
            }}
          >
            {helpEmail}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};
export default Faqs;
