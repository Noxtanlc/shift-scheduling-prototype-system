import { useState, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../misc/AuthProvider";
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
    if (!token.accessToken) {
      navigate('/login', { replace: true });
    }

    if (pathname === '/login' && token.accessToken) {
      navigate('/', { replace: true });
    }

    if (pathname === '/' && !token) {
      navigate('/login', { replace: true });
    }
  }, [token.accessToken]);

  return (
    loading ? (<Loader />) : (
      <>
        <Outlet />
      </>
    )
  );
}