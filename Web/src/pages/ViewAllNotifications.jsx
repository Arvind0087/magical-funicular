import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'components/settings';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { getAllNoticeByStudentIdAsync } from 'redux/async.api';
import CustomComponentLoader from 'components/CustomComponentLoader';
import { CustomAvatar } from 'components/custom-avatar';

export default function ViewAllNotifications() {
    const moment = require('moment');
    const dispatch = useDispatch();
    const { themeStretch } = useSettingsContext();
    const { studentById } = useSelector((state) => state?.student)
    const { notification } = useSelector(state => state)
    const { allNotification, allNotificationLoader } = notification

    useEffect(() => {
        dispatch(getAllNoticeByStudentIdAsync({
            studentId: studentById?.id
        }))
    }, [studentById?.id])

    const handleNotificationClick = (webBackLink, otherLink) => {
        if (otherLink === null) {
            return window.location.replace(webBackLink);
        } else {
            const newWindow = window.open(otherLink, "_blank");
            return newWindow.opener = null;
        }
    }
    return (
        <Container maxWidth={themeStretch ? false : "xl"}>
            {
                allNotificationLoader ?
                    <>
                        <>
                            <Box sx={{ width: '100%', mt: 20, display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
                                <CustomComponentLoader padding="0" size={50} /></Box>
                        </>
                    </>
                    :
                    <>
                            <Typography variant='h4'>Notifications</Typography>
                        <Card sx={{ mt: 2 }}>
                            {
                                allNotification?.length > 0 ?
                                    allNotification?.map((notice) => {
                                        return (
                                            <Box
                                            >
                                                <List
                                                    sx={{
                                                        width: '100%',
                                                        maxWidth: 360,
                                                        bgcolor: 'background.paper',
                                                        pointer: 'cursor',
                                                        maxWidth: '100%',
                                                    }}
                                                    onClick={() => { handleNotificationClick(notice?.webBackLink, notice?.otherLink) }}
                                                >
                                                    <ListItem
                                                    >
                                                        <ListItemAvatar>
                                                            {
                                                                notice.image != null ?
                                                                    <CustomAvatar src={notice?.image} alt={""} name={""} />
                                                                    :
                                                                    <Avatar><DoneAllIcon sx={{ color: 'primary.main' }} /></Avatar>
                                                            }
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={notice.title}
                                                            secondary={
                                                                <>
                                                                    <div
                                                                        style={{ '& p': { margin: 0 } }}
                                                                        dangerouslySetInnerHTML={{ __html: notice.description }}
                                                                    />
                                                                    <Typography variant="p" color="textSecondary">{moment.utc(notice.createdAt).format("DD-MM-YYYY HH:mm")}</Typography>
                                                                </>
                                                            }
                                                            sx={{ ml: 0 }}
                                                        >
                                                        </ListItemText>
                                                    </ListItem>
                                                    <Divider component="li" />
                                                </List>
                                            </Box>
                                        )
                                    }) :  <Box sx={{textAlign:"center"}}><p>No notification found</p></Box>
                            }
                        </Card>
                    </>
            }
        </Container>
    )
}
