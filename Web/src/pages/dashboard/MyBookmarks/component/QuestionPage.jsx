import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import ShareIcon from '@mui/icons-material/Share';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SubjectCustomTabs from "components/SubjectBlockCustom/subjectCustomTabs";
import { getAllbookmarkedQueAsync } from "redux/async.api";
import CustomComponentLoader from "components/CustomComponentLoader";
import parse from 'html-react-parser';
import Iconify from '../../../../components/iconify';
import ShareWith from '../../../../components/shareWith/ShareWith';
import NoVideo from '../../../../assets/images/NoVideos.svg';
const QuestionPage = (props) => {
  const { tabs, id } = props;
  let dispatch = useDispatch();
  const allQuestions = useSelector(state => state?.bookmarked?.bookmarkedQuestions?.data)
  const bookmarkedLoader = useSelector(state => state.bookmarked.bookmarkedQuestionsLoader)
  const [currentTab, setCurrentTab] = useState("");
  const [openShareDialog, setShareOpenDialog] = useState(false)

useEffect(()=>{
  tabs?.map((item)=>{
      if(item?.isAllSubject)
      {
      setCurrentTab(item?.id)
      dispatch(
        getAllbookmarkedQueAsync({
          bookmarkType: "question",
          userId: id,
          subjectId:item?.id
        })
      );
      }
    })
},[])

  const _dificulty = {
    Easy: "green",
    Medium: "orange",
    Hard: "red",
  };
  const handleEvent = (tabNum) => {
    setCurrentTab(tabNum)
      dispatch(getAllbookmarkedQueAsync({
        bookmarkType: 'question',
        userId: id,
        subjectId: tabNum
      }))
  };

  return (
    <>
      <Box sx={{ mt: 7 }}>
         <SubjectCustomTabs  handleEvent={ handleEvent} subjectInfo={tabs} currentTab={currentTab}/>
      </Box>
      {

        allQuestions?.length > 0 ?
          <Box sx={{ mt: 5 }}>
            <Typography variant="h6">{allQuestions?.length} Questions</Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {
                  bookmarkedLoader ?
                    <>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main', mt: 4 }}>
                        <CustomComponentLoader padding="0" size={50} />
                      </Box>
                    </> : <>
                      {allQuestions?.length > 0 ?
                        allQuestions.map((e) => {
                          return <Grid item xs={10} md={6} lg={4} key={e.id}>
                            <Card sx={{ borderRadius: "10px", padding: "20px" }}>
                              <Box sx={{
                                display: "flex",
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: "80%"
                              }}>
                                <Typography sx={{
                                  fontWeight: "400",
                                  fontSize: "20px",
                                  lineHeight: "20px",
                                }}>Q.</Typography>
                                <Typography sx={{
                                  fontWeight: "400",
                                  fontSize: "17px",
                                  lineHeight: "20px",
                                  marginLeft: "4%",
                                  width: "80%",
                                  overflow: "hidden",
                                  height: "62%",
                                  // mt: 3,
                                }}>{parse(e?.question || "")}</Typography>
                                <Typography sx={{
                                  color: "primary.main",
                                  marginLeft: "4%",
                                }}><ShareIcon
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => setShareOpenDialog(true)}
                                  /></Typography>
                              </Box>

                              <Box sx={{
                                display: "flex",
                                justifyContent: "space-around"
                              }}>
                                <Typography sx={{
                                  color: "primary.main",
                                  width: "10%"
                                }}><MenuBookIcon /></Typography>
                                <Typography sx={{
                                  marginLeft: "2%",
                                  width: "20%",
                                }}>{e.subjectName}</Typography>
                                <Typography
                                  color={_dificulty[e.difficultyLevel]}
                                  sx={{ marginLeft: "10%" }}>
                                  {
                                    e.difficultyLevel === "Easy" ? (<Iconify icon="material-symbols:signal-cellular-alt-1-bar-rounded" />)
                                      : e.difficultyLevel === "Medium" ? (<Iconify icon="material-symbols:signal-cellular-alt-2-bar-rounded" />) :
                                        <Iconify icon="material-symbols:signal-cellular-alt-rounded" />
                                  }
                                </Typography>
                                <Typography sx={{
                                  marginLeft: "2%",
                                  width: "20%",
                                  fontWeight: 800
                                }}>{e.difficultyLevel}</Typography>
                                <Typography sx={{
                                  color: "primary.main",
                                  marginLeft: "23%",
                                }}><BookmarkIcon /></Typography>
                              </Box>
                            </Card>
                          </Grid>
                        }) :
                        <Box sx={{ width: '100%', textAlign: 'center', marginTop: '80px' }}></Box>
                      }
                    </>
                }
              </Grid>
            </Box>
          </Box>
          : 
          <>
          <Box sx={{ width: '100%', textAlign: 'center',mt: 10,display:'flex',justifyContent:'center' }}>
            <img src={NoVideo}/></Box>
            <Typography variant='h6' sx={{textAlign:'center'}}>Your Bookmark is empty</Typography>
            </>
            }
  
      <ShareWith
        {...{
          setShareOpenDialog,
          openShareDialog,
        }}
      />
    </>
  )
}
export default QuestionPage;
