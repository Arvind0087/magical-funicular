import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getStudentStrengthByBatchTypeAsync = createAsyncThunk(
    "admin/studentDataByBatchTypeReport",
    async (payload, toolkit) => {
        return await AxiosClient(
            "GET",
            `/studentDataByBatchTypeReport?courseId=${payload.courseId}&boardId=${payload.boardId}`,
            [], toolkit
        );
    }
);

export const getstudentAttandenceReportAsync = createAsyncThunk(
    "admin/studentAttandenceReport",
    async (payload, toolkit) => {
        return await AxiosClient(
            "GET",
            `/studentAttandenceReport?courseId=${payload.courseId}&boardId=${payload.boardId}&classId=${payload.classId}&month=${payload.month}&year=${payload.year}`,
            [], toolkit
        );
    }
);


// userRegistered
export const userRegisteredAsync = createAsyncThunk(
    "admin/userRegistered",
    async (payload, toolkit) => {
        return await AxiosClient(
            "POST",
            `/userRegistered`,
            payload, toolkit
        );
    }
);
