import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useTheme } from '@mui/material';
import  Box from "@mui/material/Box";
import  Button from "@mui/material/Button";
import  Card from "@mui/material/Card";
import  Checkbox from "@mui/material/Checkbox";
import  Grid from "@mui/material/Grid";
import  Tab from "@mui/material/Tab";
import  Tabs from "@mui/material/Tabs";
import  Typography from "@mui/material/Typography";
import { toast } from "react-hot-toast";
import { createTestByStudentAsync, getchaptersBysubjectIdAsync } from '../../../redux/async.api';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { toastoptions } from "../../../utils/toastoptions";
import CustomComponentLoader from '../../../components/CustomComponentLoader';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const SelectTestChapters = (props) => {
  const { selectedSubjects, value } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studentById } = useSelector(state => state?.student)
  const { courseId, boardId, classId, batchTypeId, id } = studentById;
  const { getchaptersBySubjectId, getChapterLoader } = useSelector(state => state?.test)
  // states...
  const [currentTab, setCurrentTab] = useState(selectedSubjects[0]?.id);
  const [checkedBox, setCheckedBox] = useState([]);

  const getChapters = (subId) => {
    if (subId) {
      dispatch(
        getchaptersBysubjectIdAsync({
          "courseId": courseId,
          "boardId": boardId,
          "classId": classId,
          "batchTypeId": batchTypeId,
          "subjectId": subId
        })
      )
    }
  }

  useEffect(() => {
    getChapters(currentTab)
  }, [currentTab])

  const handleChange = (event, chapterId) => {
    const checkboxValue = event.target.value;
    if (event.target.checked) {
      setCheckedBox([...checkedBox, chapterId]);
    } else {
      setCheckedBox(checkedBox.filter((value) => value !== chapterId));
    }
  };
  const isButtonDisabled = checkedBox.length === 0;

  const ApplyHandler = () => {
    if (id)
      dispatch(
        createTestByStudentAsync({
          "subjectIds": value.subjects.map((item) => {
            return item.id
          }),
          "chapterIds": checkedBox,
          "difficultyLevels": value.levelss.map((item) => {
            return item.level
          }),
          "numberOfQuestions": value.noOfQue,
          "testTime": value.time,
          "createdBy": "student",
          "createdId": id
        })
      ).then((res) => {
        const { payload } = res || {};
        const { status, message } = payload || {};
        if (status === 200) {
          toast.success(message, toastoptions);
          navigate(`${PATH_DASHBOARD.instruction(res?.payload?.data?.id)}?type=my_test`)
        }
      })
  }
  return (
    <>
      {
        getChapterLoader ?
          <>
            <Box sx={{ mt: 14, display: 'flex', justifyContent: 'center' }}>
              <CustomComponentLoader padding="0" size={40} />
            </Box>
          </> :
          <>
            <Typography variant='h5' sx={{ mt: 10 }}>Select Chapters & Topics</Typography>
            <Box sx={{ mt: 4 }}>
              <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
                {selectedSubjects && selectedSubjects.map((tab, index) => (
                  <Tab key={index} label={tab.name} value={tab.id} onClick={() => setCurrentTab(tab.id)} />
                ))}
              </Tabs>
            </Box>

            <Grid container spacing={3} sx={{
              mt: 3,
              [theme.breakpoints.down('md')]: {
                mt: 0
              },
            }}>
              {
                getchaptersBySubjectId && getchaptersBySubjectId.map((item, index) => {
                  return (
                    <Grid item xs={12} md={4} key={item.id}>
                      <Card sx={{ minWidth: 275, display: 'flex', border: '1px solid gray', borderRadius: '50px', alignItems: 'center', height: '55px' }}>
                        <Checkbox {...label} checked={checkedBox.includes(item.id) ? true : false} onChange={(e) => handleChange(e, item.id)} />
                        <Typography>{item.name}</Typography>
                      </Card>
                    </Grid>
                  )
                })
              }
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                disabled={isButtonDisabled}
                sx={{
                  mt: 5,
                  borderRadius: '60px',
                  color: '#ffff',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '55px',
                  width: '33%',
                  [theme.breakpoints.down('md')]: {
                    width: '100%',
                    mt: 15
                  },
                }}
                type="submit"
                className='OTP-button'
                variant="contained"
                onClick={ApplyHandler}
              >
                Apply
              </Button>
            </Box>
          </>
      }
    </>
  )
}
export default SelectTestChapters;
