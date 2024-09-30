
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useSettingsContext } from '../../../components/settings';
import { getAllLikeShortsByStudentIdAsync, getSubjectByBatchTypeIdAsync, getSubjectsByStudentAsync } from '../../../redux/async.api';
import VideoList from './components/VidoeList';
import { useNavigate } from 'react-router';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const FavouriteShortsPage = () => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boardId, classId, courseId, batchTypeId, id } = useSelector((state) => state?.student?.studentById)
  const { subjectBy } = useSelector(state => state?.subject)
  const LikedShorts = useSelector((state) => state?.shorts?.likedShortsByStudentId?.data);
  const subjectByStudentId = subjectBy
  // tabs api call......
  useEffect(() => {
    if (!batchTypeId) return
    dispatch(
      getSubjectsByStudentAsync({
        "courseId": courseId,
        "boardId": boardId,
        "classId": classId,
        "batchTypeId": batchTypeId,
      })
    );
  }, [batchTypeId])

  const getSubjectLikedShorts = (subjectId) => {
    dispatch(getAllLikeShortsByStudentIdAsync({
      "studentId": id,
      "subjectId": subjectId
    }))
  }

  function getTabsData(subId) {
      getSubjectLikedShorts(subId)
  }
  const handleNavBackPage = () =>{
    navigate(-1)
  }
  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <Box sx={{ display: 'flex', alignItems: 'left' }}>
        <KeyboardBackspaceIcon sx={{ color: 'primary.main' }} onClick={handleNavBackPage} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Typography variant="h4">Favourite Shorts</Typography>
        <FavoriteIcon sx={{ fontSize: "30px", color: 'red' }} />
      </Box>
      <Box sx={{ mt: 1 }}>
        <VideoList getTabsData={getTabsData} allShorts={LikedShorts} tabs={subjectBy} />
      </Box>
    </Container>
  )
}

export default FavouriteShortsPage;
