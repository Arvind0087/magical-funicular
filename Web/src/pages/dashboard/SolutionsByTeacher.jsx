import React, { useEffect, useMemo, useState } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from "@mui/material/styles";
import { useSettingsContext } from "../../components/settings";
import CardImg from "../../../src/assets/images/design7.png";
import ShareIcon from "@material-ui/icons/Share";
import ModalImage from "react-modal-image";
import { Helmet } from "react-helmet-async";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getDoubtByIdAsync } from "../../redux/async.api";
import { useSelector } from "react-redux";
import moment from "moment";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import parse from 'html-react-parser';
import ShareWith from "components/shareWith/ShareWith";

function SolutionsByTeacher() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [goBackPage, setGoBackPage] = useState(false);
  const [openShareDialog, setShareOpenDialog] = useState(false)
  const { themeStretch } = useSettingsContext();
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
        <title> Doubts | {`${siteTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Doubts"
        links={[
          { name: "Dashboard", href: PATH_DASHBOARD.root },
          { name: "My Doubts", href: "/app/doubts?tab=my-doubt" },
          { name: "Solution By Teacter", href: '' }
        ]}
      />
     
      <Container maxWidth={themeStretch ? false : "xl"}>
         {
          Object.keys(doubtDetail)?.length  ? 
          <Box sx={{ display: "flex", flexDirection: 'row', textAlign: 'justify', flexWrap: 'wrap' }}>
          <Typography sx={{ fontWeight: "600" }}>Q.</Typography>
          {
            doubtDetail?.image ? (
              <Box sx={{ ml: 2, borderRadius: "9px", overflow: "hidden" }}>
                <img
                  alt={doubtDetail?.name}
                  height={200}
                  width={260}
                  src={doubtDetail?.image}

                />
              </Box>) : null
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
             onClick={() =>setShareOpenDialog(true)}
              style={{
                width: "27px",
                height: "27px",
              }}
            />
          </Box>
        </Box>: null
        } 
        
        <Box sx={{ mt: 7 }}>
          <Typography variant="h4">Solutions By Teacher</Typography>

          {doubtDetail.answers && doubtDetail?.answers?.map((item, index) => {
            return (
              <Box sx={{ ml: 2, mt: 4, width: "60%" }} key={index}>

                {
                  item?.type === "teacher" ? (
                    <>
                      <Typography variant="h6">{item?.sender}</Typography>
                      {
                        item?.image ? (<Box
                          sx={{
                            borderRadius: "4px",
                            overflow: "hidden",
                            width: "120px",
                            height: "90px",
                            mt: 1,
                          }}
                        >
                          <img
                            style={{ width: "120px", borderRadius: "4px" }}
                            src={item?.image}
                          />
                        </Box>) : null
                      }
                      <Typography sx={{ mt: 1 }}>
                        {parse(item?.answer || '')}
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
        <ShareWith
                {...{
                    setShareOpenDialog,
                    openShareDialog,
                }}
            />
      </Container>
    </>
  );
}

export default SolutionsByTeacher;
