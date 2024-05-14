import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTitleProps {
  title: string;
}

export default function Title({ title }:PageTitleProps) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [location, title]);

  return null; // This component doesn't render anything
};


