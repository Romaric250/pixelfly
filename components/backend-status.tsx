"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    const checkBackend = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
      setBackendUrl(url);
      
      try {
        const response = await fetch(`${url}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'healthy') {
            setStatus('online');
          } else {
            setStatus('offline');
          }
        } else {
          setStatus('offline');
        }
      } catch (error) {
        console.error('Backend health check failed:', error);
        setStatus('offline');
      }
    };

    checkBackend();
    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Clock className="w-4 h-4 animate-spin" />;
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'bg-yellow-100 text-yellow-800';
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'online':
        return 'Backend Online';
      case 'offline':
        return 'Backend Offline';
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className="font-medium">Backend Status</p>
              <p className="text-sm text-gray-600">{backendUrl}</p>
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
        {status === 'offline' && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Backend not running!</strong> Please start the Flask backend:
            </p>
            <code className="block mt-2 p-2 bg-red-100 rounded text-sm">
              cd backend && python app.py
            </code>
          </div>
        )}
        {status === 'online' && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ Backend is running and ready for AI processing!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
