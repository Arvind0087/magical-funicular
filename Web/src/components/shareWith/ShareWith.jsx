import React, { useState } from 'react'

import { useSelector } from 'react-redux';
import {
    Dialog, DialogTitle, IconButton,
    DialogContent, DialogContentText,
} from '@mui/material'
import { Box, Stack, Container } from '@mui/system'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { WhatsappShareButton, FacebookShareButton, TwitterShareButton, LinkedinShareButton, EmailShareButton } from 'react-share';
import { WhatsappIcon, FacebookIcon, TwitterIcon, LinkedinIcon, EmailIcon } from 'react-share';


function ShareWith({ openShareDialog, setShareOpenDialog }) {
    const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector((state) => state?.getOnlySiteSetting)
    const Subheading = ''

    return (
        <Container>
            <Dialog
                open={openShareDialog}
                onClose={() => setShareOpenDialog(true)}
            >
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <DialogTitle id='dialog-title' sx={{ color: 'primary.main' }}>  Share With Friends... </DialogTitle>
                    </Box>

                    <Box>
                        <IconButton sx={{ color: 'primary.main', mr: 2 }} size='small'>
                            <HighlightOffIcon onClick={() => setShareOpenDialog(false)} />
                        </IconButton>
                    </Box>

                </Box>

                <DialogContent>
                    <Box
                        sx={{
                            textAlign: 'center',
                            p: 3,
                            display: 'flex', flexDirection: 'row', columnGap: 3,
                        }}>
                        <WhatsappShareButton url={getOnlySiteSettingData?.socialContent} title={Subheading} >
                            <WhatsappIcon size={45} className='share-icon' logofillcolor='white' round={true}></WhatsappIcon>
                        </WhatsappShareButton>
                        <FacebookShareButton url={getOnlySiteSettingData?.socialContent} title={Subheading}>
                            <FacebookIcon size={45} className='share-icon' logofillcolor='white' round={true}></FacebookIcon>
                        </FacebookShareButton>
                        <TwitterShareButton url={getOnlySiteSettingData?.socialContent} title={Subheading}>
                            <TwitterIcon size={45} className='share-icon' logofillcolor='white' round={true}></TwitterIcon>
                        </TwitterShareButton>
                        <LinkedinShareButton url={getOnlySiteSettingData?.socialContent} title={Subheading}>
                            <LinkedinIcon size={45} className='share-icon' logofillcolor='white' round={true}></LinkedinIcon>
                        </LinkedinShareButton>
                        <EmailShareButton url={getOnlySiteSettingData?.socialContent} title={Subheading}>
                            <EmailIcon size={45} className='share-icon' logofillcolor='white' round={true}></EmailIcon>
                        </EmailShareButton>
                    </Box>
                </DialogContent>
            </Dialog>
        </Container >
    )
}

export default ShareWith
