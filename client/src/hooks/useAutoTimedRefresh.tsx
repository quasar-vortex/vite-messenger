import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRefreshQuery } from "../store/api/authApi";
import { removeCreds, setCreds } from "../store/slices/authSlice";

const useAutoTimedRefresh = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { data, isError, refetch } = useRefreshQuery();

  useEffect(() => {
    if (data) {
      dispatch(setCreds(data));
      nav("/dash");
    } else if (isError) {
      console.error("Auto-refresh failed");
      dispatch(removeCreds());
    }
  }, [data, isError, dispatch, nav]);

  useEffect(() => {
    // Set up an interval to refresh every 14 minutes
    const intervalId = setInterval(() => {
      console.log("Refreshing token...");
      refetch(); // Trigger the query to refresh the token
    }, 60 * 14 * 1000); // 14 minutes

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [refetch]);
};
export default useAutoTimedRefresh;
