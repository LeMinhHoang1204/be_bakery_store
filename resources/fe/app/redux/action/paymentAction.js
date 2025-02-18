import connectApi from "../../../settings/ConnectApi.jsx";
import {
    FETCH_DISTRICTS_PROCESS, FETCH_DISTRICTS_SUCCESS,
    FETCH_PROVINCES_PROCESS,
    FETCH_PROVINCES_SUCCESS,
    FETCH_WARDS_PROCESS, FETCH_WARDS_SUCCESS
} from "../constant/paymentType.js";


export const fetchProvinces = () => async (dispatch) => {
    dispatch({ type: FETCH_PROVINCES_PROCESS });

    const { data } = await connectApi.get("/api/ghn/provinces");

    dispatch({ type: FETCH_PROVINCES_SUCCESS, payload: data });
}

export const fetchDistricts = (provinceId) => async (dispatch) => {
    dispatch({ type: FETCH_DISTRICTS_PROCESS });
    const { data } = await connectApi.get(`/api/ghn/districts`, { params: { province_id: provinceId } });

    dispatch({ type: FETCH_DISTRICTS_SUCCESS, payload: data });
}

export const fetchWards = (districtId) => async (dispatch) => {
    dispatch({ type: FETCH_WARDS_PROCESS });

    const { data } = await connectApi.get(`/api/ghn/wards`, { params: { district_id: districtId } });

    dispatch({ type: FETCH_WARDS_SUCCESS, payload: data });
}
