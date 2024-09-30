import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

// Grievances
export const getAllGrievancesAsync = createAsyncThunk(
    "admin/getAllGrievance",
    async (payload, toolkit) => {
        return await AxiosClient(
            "GET",
            `/getAllGrievance?page=${payload.page || ""}&limit=${payload.limit || ""}`,
            [],
            toolkit
        );
    }
);

//Category
export const getGrievancesCategoryAsync = createAsyncThunk(
    "admin/getAllGrievanceCategory",
    async (payload, toolkit) => {
        return await AxiosClient(
            "GET",
            `/getAllGrievanceCategory?page=${payload.page || ""}&limit=${payload.limit || ""}&search=${payload.search || ""}`,
            [],
            toolkit
        );
    }
);

export const getAllCategoryAsync = createAsyncThunk(
    "admin/getAllGrievanceCategory",
    async (payload, toolkit) => {
        return await AxiosClient(
            "GET",
            `/getAllGrievanceCategory`,
            [],
            toolkit
        );
    }
);

export const createGrievancesCategoryAsync = createAsyncThunk(
    "admin/addGrievanceCategory",
    async (payload, toolkit) => {
        return await AxiosClient("POST", `/addGrievanceCategory`, payload, toolkit);
    }
);

export const getGrievancesCategoryByIdAsync = createAsyncThunk(
    "admin/getGrievanceCategoryById",
    async (payload, toolkit) => {
        return await AxiosClient(
            "GET",
            `/getGrievanceCategoryById/${payload}`, payload, toolkit
        );
    }
);

export const updatGrievancesCategoryIdAsync = createAsyncThunk(
    "admin/updateGrievanceCategoryById",
    async (payload, toolkit) => {
        return await AxiosClient("PUT", `/updateGrievanceCategoryById`, payload, toolkit);
    }
);


export const deleteGrievancesCategoryByIdAsync = createAsyncThunk(
    "admin/deleteGrievanceCategoryById",
    async (payload, toolkit) => {
        return await AxiosClient("DELETE", `/deleteGrievanceCategoryById/${payload}`, [], toolkit);
    }
);

//Sub-Category

export const getSubGrievancesCategoryAsync = createAsyncThunk(
    "admin/getAllGrievanceSubCategory",
    async (payload, toolkit) => {
        return await AxiosClient(
            "GET",
            `/getAllGrievanceSubCategory?page=${payload.page || ""}&limit=${payload.limit || ""}&category=${payload.category || ''}&search=${payload.search || ""}`,
            [],
            toolkit
        );
    }
);

export const createGrievancesSubCategoryAsync = createAsyncThunk(
    "admin/addGrievanceSubCategory",
    async (payload, toolkit) => {
        return await AxiosClient("POST", `/addGrievanceSubCategory`, payload, toolkit);
    }
);

export const getGrievancesSubCategoryByIdAsync = createAsyncThunk(
    "admin/getGrievanceSubCategoryById",
    async (payload, toolkit) => {
        return await AxiosClient(
            "GET",
            `/getGrievanceSubCategoryById/${payload}`, payload, toolkit
        );
    }
);

export const updatGrievancesSubCategoryIdAsync = createAsyncThunk(
    "admin/updateGrievanceSubCategoryById",
    async (payload, toolkit) => {
        return await AxiosClient("PUT", `/updateGrievanceSubCategoryById`, payload, toolkit);
    }
);

export const deleteGrievancesSubCategoryByIdAsync = createAsyncThunk(
    "admin/deleteGrievanceSubCategoryById",
    async (payload, toolkit) => {
        return await AxiosClient("DELETE", `/deleteGrievanceSubCategoryById/${payload}`, [], toolkit);
    }
);

