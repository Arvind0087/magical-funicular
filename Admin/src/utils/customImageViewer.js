import React, { useState } from 'react'
import { Box, Dialog, DialogTitle, DialogContent } from '@mui/material'

function CustomImageViewer(props) {
    const { getUserName, getUserImage, setOpenImageViewer, openImageViewer } = props
    return (
        <>
            <Dialog
                aria-labelledby='dialog-title'
                open={openImageViewer}
                onClose={() => setOpenImageViewer(false)}
            >
                <Box sx={{ marginTop: 5 }}>
                    <DialogContent>
                        <img src={getUserImage} alt={getUserName} width='300px' height='300px' />
                        <DialogTitle id='dialog-title'> Name : {getUserName}</DialogTitle>
                    </DialogContent>
                </Box>
            </Dialog>
        </>
    )
}

export default CustomImageViewer