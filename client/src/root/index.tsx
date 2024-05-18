import { useState, useEffect } from "react";
import { useLocation, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../misc/AuthProvider";
import { FetchDataApi } from "@/misc/FetchDataApi";
import Loader from "@/common/loader";
import { useQueryClient } from "@tanstack/react-query";

export default function Root() {
  const queryClient = useQueryClient();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    if (!token.accessToken) {
      navigate('/login', {replace: true});
    }
  }, [token]);

  if (token.accessToken) {
    FetchDataApi(queryClient, token.accessToken, user.isAdmin);
  }
  
  return (
    loading ? (<Loader />) : (
      <>
        <Outlet />
      </>
    )
  );
}