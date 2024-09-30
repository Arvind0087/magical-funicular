import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { addRevisionBookmarkAsync } from "redux/Revision/revisionBookMark.async";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReactReadMoreReadLess from "react-read-more-read-less";
import _ from "lodash";
import { removeTags } from "utils/removeTag";

export default function RevisionCard({ item, list, itemIn, isBookMarkRemove }) {
  const dispatch = useDispatch();
  const [listItem, setlistItem] = useState({});

  const { bookmarkLoader } = useSelector((state) => state.bookmark);

  const handleBookmark = () => {
    setlistItem({ ...listItem, bookmark: listItem.bookmark ? false : true });
    const payload = {
      subjectId: itemIn.subjectId,
      chapterId: itemIn.chapterId,
      topic: item.topic,
      revisionId: listItem.id,
      bookmarkType: itemIn.category,
      bookmark: listItem.bookmark ? 0 : 1,
    };
    if (itemIn.category !== "Quick Bites") delete payload.topic;
    dispatch(addRevisionBookmarkAsync(payload)).then((response) => {
      if (_.includes(response?.type, "rejected")) {
        setlistItem({
          ...listItem,
          bookmark: listItem.bookmark ? true : false,
        });
      } else {
        isBookMarkRemove(listItem.id);
      }
    });
  };

  useMemo(() => {
    setlistItem(list);
  }, [list]);

  return (
    <>
      <Card sx={{ p: 2, width: "100%", borderRadius: "5px" }}>
        <Box display="flex" justifyContent="space-between">
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            <ReactReadMoreReadLess
              charLimit={30}
              readMoreText={"more"}
              readLessText={"less"}
              readMoreStyle={{ fontSize: "10px", cursor: "pointer" }}
              readLessStyle={{ fontSize: "10px", cursor: "pointer" }}
            >
              {removeTags(listItem?.title)}
            </ReactReadMoreReadLess>
          </Typography>

          <Box
            sx={{
              cursor: "pointer",
              color: "primary.main",
            }}
            onClick={() => {
              if (!bookmarkLoader) {
                handleBookmark();
              }
            }}
          >
            {!listItem?.bookmark ? (
              <BookmarkBorderIcon
                sx={{
                  width: "30px",
                  height: "30px",
                }}
              />
            ) : (
              <BookmarkIcon
                sx={{
                  width: "30px",
                  height: "30px",
                }}
              />
            )}
          </Box>
        </Box>

        <Box
          sx={{
            borderRadius: "6px",
            overflow: "hidden",
            mt: 1,
            height: "190px",
          }}
        >
          <LazyLoadImage src={listItem?.image} effect="blur" width="100%" />
        </Box>
        <Typography
          sx={{
            color: "#787A8D",
            pt: "10px",
          }}
        >
          <ReactReadMoreReadLess
            charLimit={150}
            readMoreText={"more"}
            readLessText={"less"}
            readMoreStyle={{ fontSize: "16px", cursor: "pointer" }}
            readLessStyle={{ fontSize: "16px", cursor: "pointer" }}
          >
            {removeTags(listItem?.description)}
          </ReactReadMoreReadLess>
        </Typography>
      </Card>
    </>
  );
}
