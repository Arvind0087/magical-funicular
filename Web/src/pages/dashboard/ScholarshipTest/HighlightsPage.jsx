import React from "react";
import { useTheme, } from "@mui/system";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CustomComponentLoader from "../../../components/CustomComponentLoader/CustomComponentLoader";
const HighlightsPage = (props) => {
  const { AllHighlight, getAllHighlightLoader } = props
  const theme = useTheme();
  return (
    <>
      {getAllHighlightLoader ? <><Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
        <CustomComponentLoader padding="0" size={50} />
      </Box></> : <>
        <Grid container spacing={4} sx={{
          alignItems: "center",
          [theme.breakpoints.down('md')]: {
            justifyContent: "center"
          }
        }}>
          {AllHighlight.length > 0 ? <>{AllHighlight?.map((item, index) => {
            return <Grid item xs={10} md={6} lg={4} key={index}>
              <Box sx={{
                height: "150px", borderRadius: "10px",
                p: 1,
                display: "flex",
                justifyContent: "space-around",
                border: "2px solid #E2E2E2",
                overflow: "hidden"
              }}>
                <Box sx={{
                  width: "20%", display: "flex", flexDirection: "column",
                  justifyContent: "center",
                }}>
                  <Box sx={{ height: "90px", width: "80px", borderRadius: "7px" }}>
                    <img alt={"image"} src={item?.image} width="100%" height={"100%"} style={{ borderRadius: "7px" }} />
                  </Box>
                </Box>
                <Box sx={{
                  width: "77%", display: "flex", flexDirection: "column", p: 1,
                  justifyContent: "space-around", marginLeft: "15px"
                }}>
                  <Typography sx={{ fontWeight: "600", minHeight: "30%", overflow: "hidden", width: "100%" }}>{item?.title}</Typography>
                  <Typography sx={{ color: "#787A8D", fontSize: "16px", height: "60%", overflow: "hidden", width: "100%" }}>{item?.description}</Typography>
                </Box>
              </Box>
            </Grid>
          })}</> : <><Box sx={{ width: '100%', textAlign: 'center', marginTop: '80px' }}><Typography variant="h5">No Data Found</Typography></Box></>}
        </Grid>
      </>
      }
    </>
  )
}
export default HighlightsPage
