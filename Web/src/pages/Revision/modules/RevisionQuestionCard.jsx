import React, { useMemo, useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useDispatch } from "react-redux";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { addRevisionBookmarkAsync } from "redux/Revision/revisionBookMark.async";
import _ from "lodash";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { removeTags } from "utils/removeTag";

export default function RevisionQuestionCard({
  item,
  list,
  itemIn,
  isBookMarkRemove,
}) {
  const dispatch = useDispatch();
  const [listItem, setlistItem] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);

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
      <Card
        sx={{
          p: 2,
          width: "100%",
          transition: "max-height.4s",
          borderRadius: "5px",
        }}
        style={{ maxHeight: `${showAnswer ? "100%" : "180px"}` }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
            }}
          >
            {item?.list?.length}/{itemIn?.In + 1}
          </Typography>
          <Box
            sx={{
              cursor: "pointer",
              color: "primary.main",
            }}
            onClick={handleBookmark}
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

        <Typography
          sx={{
            fontWeight: "700",
            fontSize: "16px",
            mt: 1,
          }}
        >
          <ReactReadMoreReadLess
            charLimit={100}
            readMoreText={"more"}
            readLessText={"less"}
            readMoreStyle={{ fontSize: "10px", cursor: "pointer" }}
            readLessStyle={{ fontSize: "10px", cursor: "pointer" }}
          >
            {removeTags(listItem?.title)}
          </ReactReadMoreReadLess>
        </Typography>
        {showAnswer && (
          <Box>
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
              {removeTags(listItem?.description)}
            </Typography>
          </Box>
        )}
        <Divider sx={{ mt: 2 }} />
        <Typography
          sx={{
            fontWeight: "500",
            textAlign: "center",
            color: "primary.main",
            cursor: "pointer",
            mt: 1,
          }}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {!showAnswer ? "Show Answer" : "Hide Answer"}
        </Typography>
      </Card>
    </>
  );
}
