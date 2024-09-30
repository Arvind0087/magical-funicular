import React, { useEffect } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from "@mui/material/styles";
import { useSettingsContext } from "../../components/settings";
import CardImg from "../../../src/assets/images/design7.png";
import ShareIcon from "@material-ui/icons/Share";

import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getDoubtByIdAsync } from "../../redux/async.api";
import moment from "moment";
import parse from 'html-react-parser';

function SolutionsByStudents() {
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { state } = useLocation();
  const { doubtDetail } = useSelector((state) => state?.doubt);
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector((state) => state.getOnlySiteSetting)
  const { siteLogo, siteAuthorName, favicon, siteTitle } = getOnlySiteSettingData
  useEffect(() => {
    dispatch(getDoubtByIdAsync(state?.id))
  }, []);

  return (
    <>
      <Helmet>
        <title>Doubts | {`${siteTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "xl"}>
        <Box sx={{ display: "flex", flexDirection: 'row', textAlign: 'justify', flexWrap: 'wrap' }}>
          <Typography sx={{ fontWeight: "600" }}>Q.</Typography>
          {
            doubtDetail?.image ? (
              <Box sx={{ ml: 2, borderRadius: "9px", overflow: "hidden" }}>
                <img
                  src={doubtDetail?.image}
                  alt=""
                  style={{ width: "260px", height: "200px" }}
                />
              </Box>
            ) : null
          }

          <Typography sx={{ ml: 2, fontWeight: "600" }}>
            {doubtDetail?.question}
          </Typography>
          <Box
            sx={{
              cursor: "pointer",
              color: "primary.main",
              width: "10%",
              ml: 2,
            }}
          >
            <ShareIcon
              style={{
                width: "27px",
                height: "27px",
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 7 }}>
          <Typography variant="h4">Solutions By Student</Typography>

          {doubtDetail.answers && doubtDetail?.answers?.map((item, index) => {
            return (
              <Box sx={{ ml: 2, mt: 4, width: "60%" }} key={index}>
                {
                  item?.type === "student" ? (
                    <>
                      <Typography variant="h6">{item?.sender} </Typography>
                      {
                        item?.image ? (
                          <Box sx={{ borderRadius: "4px", overflow: "hidden", width: "120px", height: "100px", mt: 1, }}>
                            <img
                              src={item?.image}
                              alt=""
                              style={{ width: "160px", height: "100px" }}
                            />
                          </Box>
                        ) : null
                      }
                      <Typography sx={{ mt: 1 }}>
                        {parse(item?.answer)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",

                        }}
                      >
                        <b>Posted On:</b> {moment(item?.createdAt).format("DD MMM, YYYY hh:mm A")}
                      </Typography>
                    </>
                  ) : null
                }
              </Box>
            )
          })}
        </Box>
      </Container>
    </>
  );
}

export default SolutionsByStudents;
