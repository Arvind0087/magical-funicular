import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme, } from "@mui/system";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import certificate from "../../../assets/images/image 17.svg";
import lock from "../../../assets/images/submit-details.png.svg";
import idCard from "../../../assets/images/submit-details.png (1).svg";
import successLogo from "../../../assets/images/success-registration.png.svg";
import CustomComponentLoader from "../../../components/CustomComponentLoader";
import { getScholarshipClassByUserIdAsync, getAllHighlightAsync } from "../../../redux/async.api";
import Timer from "./Timer";
import RegisterScholarship from "./RegisterScholarship";
import ScholarshipClasses from "./ScholarshipClsses";
import HighlightsPage from "./HighlightsPage";
import FAQScholarship from "./FAQScholarship";
import { WhatsappShareButton, FacebookShareButton, TwitterShareButton, LinkedinShareButton, EmailShareButton } from 'react-share';
import { WhatsappIcon, FacebookIcon, TwitterIcon, LinkedinIcon, EmailIcon } from 'react-share';
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate } from "react-router";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Helmet } from "react-helmet-async";

const ScholarshipTestPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentById = [] } = useSelector((state) => state?.student);
  const { id } = studentById;
  const { ScholarshipClassByUserIdLoader, ScholarshipClassByUserId = [], getAllHighlightLoader, AllHighlight = [] } = useSelector((state) => state?.scholarshipTest);
  const { finalScholarship = {}, classes = [] } = ScholarshipClassByUserId;
  const { getOnlySiteSettingData = {} } = useSelector((state) => state.getOnlySiteSetting)
  const { testinstruction } = useSelector(state => state?.test)
  const { siteTitle } = getOnlySiteSettingData
  // state
  const [showRegister, setShowRegister] = useState(null)
  const [showExam, setShowExam] = useState(false)
  const [open, setOpen] = useState(false);
  const [appliedForScholarship, setAppliedForScholarship] = useState(false)
  // Social Content
  const heading = getOnlySiteSettingData.socialContent
  const Subheading = ''

  const handleTimerData = (data) => {
    setShowRegister(data);
  }
  const handleShowExam = (data) => {
    setShowExam(data);
  }
  const handleClose = (value) => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleappliedForScholarship = (data) => {
    setAppliedForScholarship(data)
  }
  useEffect(() => {
    if (id) {
      dispatch(getScholarshipClassByUserIdAsync({
        userId: id
      }))
    }
  }, [id, appliedForScholarship, dispatch])

  useEffect(() => {
    dispatch(getAllHighlightAsync())
  }, [dispatch])

  const handleNavBackPage = () => {
    navigate(-1)
  }
  //NOTE : navigate to instruction page 
  const handleNavInstructionPage = () => {
    navigate(`${PATH_DASHBOARD.instruction(finalScholarship?.scholarshipId)}?type=scholarship_test`)
  }

  return (
    <>
      <Helmet>
        <title>Scholarship Test | {`${siteTitle}`}</title>
      </Helmet>
      <Container sx={{ alignItems: "center", }}>
        <Box sx={{
          [theme.breakpoints.down('md')]: {
            textAlign: "center"
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            <KeyboardBackspaceIcon sx={{ color: 'primary.main' }} onClick={handleNavBackPage} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="h4">Scholarship Test</Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={4} sx={{
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Grid item xs={10} md={6} lg={4} sx={{ display: Object.keys(finalScholarship)?.length <= 0 ? "none" : "block" }}>
              <Box sx={{
                height: "150px", borderRadius: "10px", p: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                bgcolor: "primary.main"
              }}>
                <Box>
                  <Typography variant="h4" sx={{ color: "white" }}>{finalScholarship?.title}</Typography>
                </Box>
                <Box>
                  <Button variant="contained"
                    sx={{
                      borderRadius: "18px", color: "primary.main",
                      bgcolor: "white", fontWeight: "400"
                    }}
                  >{finalScholarship?.class}</Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={4} sx={{
            alignItems: "center",
            mt: 2,
            [theme.breakpoints.down('md')]: {
              justifyContent: "center"
            }
          }}>
            <Grid item xs={10} md={6} lg={4}>
              <Box sx={{
                height: "150px", borderRadius: "10px", p: 1,
                textAlign: "center",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                bgcolor: "#7F159A"
              }}>
                <Typography sx={{ fontSize: "17px" }}>{siteTitle} Scholarship Test will ({siteTitle}) empower you with an in-depth analysis of your academic proficiency</Typography>
              </Box>
            </Grid>
            <Grid item xs={10} md={6} lg={4}>
              <Box sx={{
                height: "150px", borderRadius: "10px", p: 1,
                textAlign: "center",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                bgcolor: "#372FCF"
              }}>
                <Typography sx={{ fontSize: "17px" }}>{siteTitle} will help you identify your strengths and areas of improvement in academic subjects like Maths & Science.</Typography>
              </Box>
            </Grid>
            <Grid item xs={10} md={6} lg={4}>
              <Box sx={{
                height: "150px", borderRadius: "10px", p: 1,
                textAlign: "center",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                bgcolor: "#F32482"
              }}>
                <Typography sx={{ fontSize: "17px" }}>Get upto 100% scholarship on {siteTitle} courses with your {siteTitle} score.</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4} sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: Object.keys(finalScholarship)?.length > 0 ? "space-between" : "space-evenly",
            [theme.breakpoints.down('md')]: {
              justifyContent: "center"
            }
          }}>
            <Grid item xs={10} md={6} lg={5.5}>
              <Box
                sx={{
                  height: "200px", borderRadius: "10px", p: 1,
                  textAlign: "center",
                  border: "2px solid #E2E2E2",
                  display: "flex",
                  m: 0,
                  overflow: "hidden",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}>
                <Box sx={{ width: "70%" }}>
                  <Typography variant="h5">Crack this Scholarship Test to win up to</Typography>
                </Box>
                <Box sx={{ width: "80%", fontWeight: "600" }}>
                  <Typography variant="h4" sx={{ color: "#4D993B" }}>100% Scholarship</Typography>
                </Box>
                <Box sx={{ width: "30%", height: "30%", fontWeight: "600" }}>
                  <img src={certificate} height="100%" width="100%" alt="" object-fit="cover" />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={10} md={6} lg={5.5} sx={{ display: Object.keys(finalScholarship)?.length <= 0 ? "none" : "block" }}>
              <Timer
                ScholarshipClassByUserId={ScholarshipClassByUserId}
                handleTimerData={handleTimerData}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: 6 }}>
          <Grid item xs={10} md={10} lg={8} sx={{
            height: "50px",
            pl: "0px !important",
            pt: "8px !important",
            m: 0,
            overflow: "hidden",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: 'center',
            display: (Object.keys(finalScholarship).length > 0 && finalScholarship?.apply) || !showRegister ? "none" : "flex"
          }}>
            <Button
              variant="contained"
              onClick={handleClickOpen}
              sx={{
                height: "100%",
                borderRadius: "12px",
                minWidth: "20%",
                color: "white",
                fontSize: "16px",
                paddingTop: "8px",
                cursor: "pointer"
              }}
            >Register for free Now</Button>
          </Grid>
          <Grid item xs={10} md={10} lg={8} sx={{
            height: "50px",
            pl: "0px !important",
            pt: "8px !important",
            justifyContent: "center",
            m: 0,
            overflow: "hidden",
            flexDirection: "column",
            alignItems: "center",
            display: showExam && finalScholarship?.apply ? "flex" : "none"
          }}>
            <Button
              variant="contained"
              onClick={handleNavInstructionPage}
              sx={{
                height: "100%",
                borderRadius: "12px",
                minWidth: "20%",
                color: "white",
                fontSize: "16px",
                paddingTop: "8px",
                cursor: "pointer"
              }}
            >Start Scholarship Test</Button>
          </Grid>
        </Box>
        <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>

          <Grid container spacing={4} sx={{
            alignItems: "center",
            display: classes?.length <= 0 ? "none" : "flex",
            justifyContent: classes?.length === 1 ? "space-around" : "flex-start",
            [theme.breakpoints.down('md')]: {
              justifyContent: "center"
            }
          }}>

            {ScholarshipClassByUserIdLoader ? <><Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
              <CustomComponentLoader padding="0" size={50} />
            </Box></> : <>
              {ScholarshipClassByUserId?.classes?.length > 0 && classes?.map((item, index) => {
                return <ScholarshipClasses item={item} key={index} handleShowExam={handleShowExam} />
              })}</>}
          </Grid>
        </Box>
        <Box sx={{
          mt: 6,
          [theme.breakpoints.down('md')]: {
            textAlign: "center"
          }
        }}>
          <Typography variant="h4">Top Highlights</Typography>
          <HighlightsPage AllHighlight={AllHighlight} getAllHighlightLoader={getAllHighlightLoader} />
        </Box>
        <Box sx={{
          mt: 6,
          bgcolor: "#EEF3FC", pb: 2,
          p: 1,
          [theme.breakpoints.down('md')]: {
            textAlign: "center"
          }
        }}>
          <Typography variant="h4">How to Register</Typography>
          <Grid container spacing={0} sx={{
            alignItems: "center", textAlign: "center",
            [theme.breakpoints.down('md')]: {
              justifyContent: "center"
            }
          }}>
            <Grid item xs={12} md={6} lg={4} sx={{ alignItems: "center" }} >
              <Box sx={{
                height: "180px", borderRadius: "10px",
                p: 1,
                pl: 2,
                pr: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <Box sx={{ width: "30%", height: "60%", alignItems: "center", display: 'flex', justifyContent: 'center' }}>
                  <img src={lock} sx={{ width: "100%", height: "100%" }} alt='' />
                </Box>
                <Box sx={{}}>
                  <Typography>Verify your mobile number with <b>OTP</b></Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={10} md={6} lg={4}>
              <Box sx={{
                height: "180px", borderRadius: "10px",
                p: 1,
                pl: 2,
                pr: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <Box sx={{ width: "30%", height: "60%", alignItems: "center", display: 'flex', justifyContent: 'center' }}>
                  <img src={idCard} sx={{ width: "100%", height: "100%", }} alt='' />
                </Box>
                <Box sx={{}}>
                  <Typography>Enter your <b>details</b> and Submit</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={10} md={6} lg={4}>
              <Box sx={{
                height: "180px", borderRadius: "10px",
                p: 1,
                pl: 2,
                pr: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
              }}>
                <Box sx={{ width: "30%", height: "60%", alignItems: "center", display: 'flex', justifyContent: 'center' }}>
                  <img src={successLogo} sx={{ width: "100%", height: "100%", objectFit: "cover" }} alt='' />
                </Box>
                <Box>
                  <Typography>You have now successfully <b>registered</b> for {siteTitle}scholarship test</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={10} md={10} lg={7} sx={{
            height: "50px", borderRadius: "10px",
            pl: "0px !important",
            pt: "8px !important",
            textAlign: "center",
            display: "flex",
            mt: 1,
            overflow: "hidden",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
          }}>
            <Button
              variant="contained"
              onClick={handleClickOpen}
              sx={{
                cursor: "pointer",
                height: "100%",
                borderRadius: "12px",
                minWidth: "20%",
                color: "white",
                fontSize: "16px",
                paddingTop: "8px",
                display: (Object.keys(finalScholarship).length > 0 && finalScholarship?.apply) || !showRegister ? "none" : "block"
              }}
            >Register for free Now</Button>
          </Grid>
          <Grid item xs={10} md={10} lg={8} sx={{
            height: "50px",
            pl: "0px !important",
            pt: "8px !important",
            justifyContent: "center",
            m: 0,
            overflow: "hidden",
            flexDirection: "column",
            alignItems: "center",
            display: showExam && finalScholarship?.apply ? "flex" : "none"
          }}>
            <Button
              variant="contained"
              onClick={handleNavInstructionPage}
              sx={{
                height: "100%",
                borderRadius: "12px",
                minWidth: "20%",
                color: "white",
                fontSize: "16px",
                paddingTop: "8px",
                cursor: "pointer"
              }}
            >Start Scholarship Test</Button>
          </Grid>
        </Box>
        <Box sx={{
          mt: 6, textAlign: "center", display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography variant="h4">Share & Invite Your Friends to Take {siteTitle}</Typography>
          <Box sx={{ textAlign: 'center', mt: 3, display: 'flex', flexDirection: 'row', columnGap: 3, }}>
            <WhatsappShareButton url={heading} title={Subheading} >
              <WhatsappIcon size={45} className='share-icon' logofillcolor='white' round={true}></WhatsappIcon>
            </WhatsappShareButton>
            <FacebookShareButton url={heading} title={Subheading}>
              <FacebookIcon size={45} className='share-icon' logofillcolor='white' round={true}></FacebookIcon>
            </FacebookShareButton>
            <TwitterShareButton url={heading} title={Subheading}>
              <TwitterIcon size={45} className='share-icon' logofillcolor='white' round={true}></TwitterIcon>
            </TwitterShareButton>
            <LinkedinShareButton url={heading} title={Subheading}>
              <LinkedinIcon size={45} className='share-icon' logofillcolor='white' round={true}></LinkedinIcon>
            </LinkedinShareButton>
            <EmailShareButton url={heading} title={Subheading}>
              <EmailIcon size={45} className='share-icon' logofillcolor='white' round={true}></EmailIcon>
            </EmailShareButton>
          </Box>
        </Box>
        <Box sx={{
          mt: 6, [theme.breakpoints.down('md')]: {
            textAlign: "center"
          }
        }}>
          <Typography variant="h4">Frequently Asked Questions</Typography>
          <FAQScholarship />
        </Box>
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Card sx={{
            marginTop: '20px',
            marginInline: 'auto',
            width: '98.5%',
            maxHeight: '250px',
            p: 2,
            ml: 0,
          }}>
            <Typography sx={{ fontSize: "17px" }}>Please send your queries to <span style={{ color: "rgb(0,163,205)" }}>{testinstruction?.helpEmail}</span> or call on {siteTitle} Helpline <Typography sx={{ fontSize: "600", color: "primary.main" }}>{testinstruction?.helpLineNumber} </Typography></Typography>
          </Card>
        </Box>
      </Container>
      <RegisterScholarship open={open}
        setOpen={setOpen}
        handleappliedForScholarship={handleappliedForScholarship}
        scholarshipId={finalScholarship?.scholarshipId}
        onClose={handleClose} />
    </>
  )
}
export default ScholarshipTestPage
