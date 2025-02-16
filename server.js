import { ImageResponse } from '@vercel/og';
import React from 'react';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Send a POST request', { status: 405 });
  }

  try {
    const { html = '' } = await req.json();

    return new ImageResponse(
      (
        <div 
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#f3f4f6', // bg-gray-100
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
          }}
        >
          <div 
            style={{
              width: '400px',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '1.5rem',
            }}
          >
            <h2 
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                textAlign: 'center',
                color: '#374151',
                marginBottom: '1.5rem',
              }}
            >
              Login
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label 
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
              >
                Email
              </label>
              <input 
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label 
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
              >
                Password
              </label>
              <input 
                type="password"
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                }}
              />
            </div>
            
            <button 
              style={{
                width: '100%',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                marginBottom: '1rem',
              }}
            >
              Login
            </button>
            
            <p 
              style={{
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#6b7280',
              }}
            >
              Don't have an account? 
              <span 
                style={{
                  color: '#3b82f6',
                  marginLeft: '0.25rem',
                  textDecoration: 'underline',
                }}
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(`Error generating image: ${error.message}`, { status: 500 });
  }
}