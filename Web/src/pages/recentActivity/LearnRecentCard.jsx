import React, { useState, } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import _ from "lodash";
import { toast } from "react-hot-toast";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { addBookmarkAsync } from "redux/bookmark/bookmark.async";
import { toastoptions } from "utils/toastoptions";

const LearnRecentCard = (props) => {
    const { item } = props
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [bookmark, setBookmark] = useState(item?.bookmark)
    const handleBookmark = () => {
        const payload = {
            subjectId: item?.subjectId,
            typeId: item?.videoId,
            bookmarkType: "video",
            bookmark: bookmark ? 0 : 1,
        }
        dispatch(addBookmarkAsync(payload)).then((res) => {
            const { payload } = res || {};
            const { status, message } = payload || {};
            if (status === 200) {
                toast.success(message, toastoptions);
            }
        })

        setBookmark(!bookmark)
    }
    const handleNavVideoPlayerPage = (itemId, subjectId) =>{
        navigate(`/app/syllabus/${itemId}`, {
            state: {
                subjectId: subjectId
            }
        }
        )
    }
    return <>
        <Grid item key={item.videoId} xs={12} sm={6} md={4}>
            <Box
                sx={{
                    height: 140,
                    mt: 2,
                    display: "flex",
                    p: 2,
                    justifyContent: "space-between",
                    border: "2px solid rgb(234, 234, 234)",
                    borderRadius: "6px"
                }}
            >
                <Card sx={{ width: "70%", height: "100%", borderRadius: "16px", alignItems: "center", cursor:"pointer" }}
                    onClick={ ()=>{ handleNavVideoPlayerPage(item?.id, item?.subjectId ) }}
                >
                    <LazyLoadImage
                        alt={item?.subject}
                        effect="blur"
                        src={item?.thumbnail}
                        width="100%"
                        height="100%"
                        borderRadius="16px"
                        objectFit="cover"
                    />
                </Card>
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: "100%",
                        ml: 2,
                        cursor:"pointer"
                    }}
                    onClick={() =>
                         handleNavVideoPlayerPage(item?.id, item?.subjectId )
                    }
                >
                    <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                        {_.truncate(item?.name, { length: 30 })}
                    </Typography>
                    <Typography sx={{ fontSize: "15px" }}>
                        {item?.chapterName}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "15px",
                            color: "primary.main",
                            fontWeight: "600"
                        }}
                    >
                        {item?.subject}
                    </Typography>
                </Box>
                <Box >
                    {bookmark ? (
                        <BookmarkIcon
                            fontSize="medium"
                            sx={{
                                color: 'primary.main',
                                cursor: "pointer",
                                "&:hover": {
                                    background: "primary.lighter",
                                    p: "5px",
                                    borderRadius: "50px",
                                },
                            }}
                            onClick={handleBookmark}
                        />
                    ) : (
                        <BookmarkBorderIcon
                            color="white"
                            sx={{
                                cursor: "pointer",
                                "&:hover": {
                                    background: "#c8facd",
                                    p: "5px",
                                    borderRadius: "50px",
                                },
                            }}
                            onClick={handleBookmark}
                        />
                    )}
                </Box>
            </Box>
        </Grid>
    </>
}
export default LearnRecentCard;