import { Box, Button, Card, Checkbox, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useSettingsContext } from "../../../components/settings";
import { getTestInstructionAsync } from "../../../redux/async.api";
import { PATH_PAGE } from "../../../routes/paths";
import Instructions from "./components/Instruction";
import Legends from "./components/Legends";
import CustomComponentLoader from "components/CustomComponentLoader";


function InstructionPage() {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };;
  const dispatch = useDispatch();
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('Instructions');
  const [enable, setEnable] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const testType = searchParams.get("type");
  const { testInstructionLoader, testinstruction } = useSelector(state => state?.test)

  const handleChange = (e) => {
    setEnable(!enable)
  }
  const TABS = [
    {
      value: 'Instructions',
      label: 'Instructions',
      component: <Instructions testinstruction={testinstruction} testInstructionLoader={testInstructionLoader} />,
    },
    {
      value: 'Legends',
      label: 'Legends',
      component: <Legends handleChange={handleChange} />,
    },
  ];

  useEffect(() => {
    dispatch(
      getTestInstructionAsync({
        type: 'instruction'
      })
    )
  }, [])

//NOTE : navigate to start test page
const handlenavStartTest = () =>{
  navigate(`${PATH_PAGE.startTest}/${id || 0}?type=${testType}`)
}
  return (
    <>
      <Container maxWidth={themeStretch ? false : "xl"}>
      {testInstructionLoader? <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main',mt:35}}>
                  <CustomComponentLoader padding="0" size={50}/>
            </Box> : <>
        <Card sx={{ p: 4 }}>
          <Box>
            <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
              {TABS.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>

            {TABS.map(
              (tab) =>
                tab.value === currentTab && (
                  <Box key={tab.value} sx={{ mt: 5 }}>
                    {tab.component}
                  </Box>
                )
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 4 }}>
            <Checkbox {...label} onChange={(e) => handleChange(e)} />
            <Typography>I have read and understood the instructions. All the computer hardware allotted to me are in a proper working condition. I declare that I am not in possession of, carrying or wearing any prohibited gadget, such as mobile phone, bluetooth devices, or any other prohibited material (notes, chits, etc.) into the examination hall. I affirm that in case of not adhering to the above instructions, I shall be liable to be
              debarred from this test and/or be subjected to disciplinary action, which may include a ban from future tests/ examinations.</Typography>
          </Box>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <Button
            sx={{
              borderRadius: '60px',
              color: '#ffff',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // padding: '10px 36px',
              height: '44px',
              width: '30%',
              [theme.breakpoints.down('sm')]: {
                width: '100%'
              },
            }}
            type="submit"
            className='OTP-button'
            variant="contained"
            disabled={enable ? false : true}
            onClick={handlenavStartTest}
          >
            Proceed
          </Button>
        </Box>
       </>}
      </Container>
    </>
  );
}
export default InstructionPage;
