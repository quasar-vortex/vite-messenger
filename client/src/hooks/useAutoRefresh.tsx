import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRefreshQuery } from "../store/api/authApi";
import { setCreds } from "../store/slices/authSlice";

import { useNavigate } from "react-router-dom";
const useAutoRefresh = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useRefreshQuery();

  useEffect(() => {
    if (isLoading) console.log(`Attempting auto login`);
    if (data) {
      dispatch(setCreds(data));
      nav("/dash");
    }
  }, [data, isLoading, isError]);
};

export default useAutoRefresh;
