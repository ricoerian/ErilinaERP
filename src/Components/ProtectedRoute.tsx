import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { URL_BECC } from '../Utils/Constants'

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { company } = useParams<{ company: string }>()
  const [allowed, setAllowed] = useState(false)
  const slug = company?.toLowerCase().replace(/\s+/g, '') ?? '';
  const navigate = useNavigate();

  useEffect(() => {
      if (!slug) return;
      (async () => {
        try {
          const res = await fetch(
            `${URL_BECC}/api/check-company/${slug}/private`,
            {
              method: 'GET',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            }
          );
  
          switch (res.status) {
            case 200: {
              const data = await res.json();
              if (data.slug && data.slug !== slug) {
                navigate(`/${data.slug}/dashboard`, { replace: true });
                return;
              }
              return;
            }
            case 401:
            case 403:
            case 404:
              navigate(`/${slug}/login`, { replace: true });
              return;
            default:
              throw new Error(`Unexpected status ${res.status}`);
          }
        } catch (err) {
          console.error(err);
          navigate(`/${slug}/login`, { replace: true });
        }
      })();
    }, [slug, navigate]);

  useEffect(() => {
    if (!company) {
      window.location.href = '/login'
      return
    }

    fetch(`${URL_BECC}/api/protected`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (res.ok) {
          setAllowed(true)
        } else {
          window.location.href = `/${company}/login`
        }
      })
      .catch(() => {
        window.location.href = `/${company}/login`
      })
  }, [company])

  if (!allowed) {
    return null
  }

  return children
}

export default ProtectedRoute
