import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from 'react-router';
import { loginWithUserIdAsync } from '../../../redux/async.api';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { toastoptions } from "../../../utils/toastoptions";


export const MultipleUserPopUp = (props) => {
  const { onClose, selectedValue, open, users } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    dispatch(
      loginWithUserIdAsync({
        userId: value.id,
        studentType: value.studentType,
        deviceType: "Web",
        // deviceToken: systemToken 


      })
    ).then(res => {
      const { payload } = res || {};
      const { status, message } = payload || {};
      if (status === 200) {
        toast.success(message, toastoptions);
      }
    })
    onClose(value);
    setTimeout(() => {
      navigate(PATH_DASHBOARD.app)
    }, 2000);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Login with</DialogTitle>
        <List sx={{ pt: 0 }}>
          {users?.length > 0 && users.map((user) => (
            <ListItem disableGutters>
              <ListItemButton onClick={() => handleListItemClick(user)} key={user.id}>
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  )
}
