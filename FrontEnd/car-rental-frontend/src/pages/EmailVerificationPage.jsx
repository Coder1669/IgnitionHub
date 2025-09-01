import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import authService from '../services/auth.service';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email, please wait...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      authService.verifyEmail(token)
        .then(response => {
          setStatus('success');
          setMessage(response.data.message || 'Email verified successfully!');
        })
        .catch(error => {
          setStatus('error');
          setMessage(error.response?.data?.error || 'Verification failed. Link may be invalid or expired.');
        });
    } else {
      setStatus('error');
      setMessage('No verification token found.');
    }
  }, [searchParams]);

  return (
    <div className="container mt-5 text-center">
      {status === 'verifying' && <h1><div className="spinner-border" role="status"></div> Verifying...</h1>}
      {status === 'success' && <h1 className="text-success">✅ Verification Successful!</h1>}
      {status === 'error' && <h1 className="text-danger">❌ Verification Failed</h1>}
      
      <p className="lead mt-3">{message}</p>
      
      {status === 'success' && <Link to="/login" className="btn btn-primary mt-3">Proceed to Login</Link>}
    </div>
  );
};

export default EmailVerificationPage;