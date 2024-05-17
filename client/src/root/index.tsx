import { useState, useEffect } from "react";
import { useLocation, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../misc/AuthProvider";
import Loader from "@/common/loader";

export default function Root() {
  const { token } = useAuth()!;
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
      navigate('/login');
    }
  }, [token.accessToken])

  return (
    loading ? (<Loader />) : (
      <>
        <Outlet />
      </>
    )
  );
}