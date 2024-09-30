import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";


export const getStudentOwnTest = createAsyncThunk(
    "admin/getOwnTest",
    async (payload, toolkit) => {
        return await AxiosClient(
            "GET",
            `/getOwnTest?page=${payload.page || ""}&limit=${payload.limit || ""}`,
            [],
            toolkit
        );
    }
);

