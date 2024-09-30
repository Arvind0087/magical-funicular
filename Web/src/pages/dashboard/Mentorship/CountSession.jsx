import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllowedSessionByUserIdAsync } from "../../../redux/async.api";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { useNavigate } from "react-router";
export default function CountSession({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { studentById = [] } = useSelector((state) => state?.student);
    const { id } = studentById
    // state
    const [toMentorship, setToMentorship] = useState(false)
    useEffect(() => {
        dispatch(getAllowedSessionByUserIdAsync({
            userId: id
        })).then((res) => {
            const { payload } = res || {};
            const { status, data } = payload || {};
            if (status === 200) {
                if (data?.sessionAvailable > 0) {
                    navigate(PATH_DASHBOARD.mentorshipBookCalender)
                }
                else if (data?.sessionAvailable === 0) {
                    setToMentorship(true)
                }
            }
            });
    }, [])
    if (toMentorship) {
        return children
    }

}
