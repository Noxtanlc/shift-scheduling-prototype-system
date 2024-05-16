import { useState, useEffect } from "react";
import { useLocation, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/AuthProvider";
import Loader from "@/common/loader";

export default function Root() {
  const { token } = useAuth();
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
    if (!token) {
      navigate('/login', {replace: true});
    }
  }, [token]);

  if (!token) {
    navigate('/', {replace: true});
  }

  return (
    loading ? (<Loader />) : (
      <>
        <Outlet />
      </>
    )
  );
}