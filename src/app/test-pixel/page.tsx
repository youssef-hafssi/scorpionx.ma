'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TestPixelPage() {
  const [pixelStatus, setPixelStatus] = useState<'checking' | 'found' | 'not-found'>('checking');
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    // Check if fbq exists
    const checkPixel = () => {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        setPixelStatus('found');
        setEvents(['✅ Meta Pixel loaded successfully']);
      } else {
        setPixelStatus('not-found');
        setEvents(['❌ Meta Pixel not found']);
      }
    };

    // Wait a bit for the script to load
    setTimeout(checkPixel, 1000);
  }, []);

  const testEvent = (eventName: string) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      try {
        (window as any).fbq('track', eventName);
        setEvents(prev => [...prev, `✅ Fired: ${eventName}`]);
      } catch (error) {
        setEvents(prev => [...prev, `❌ Error firing ${eventName}: ${error}`]);
      }
    } else {
      setEvents(prev => [...prev, '❌ fbq is not available']);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Meta Pixel Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              {pixelStatus === 'checking' && (
                <>
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                  <span>Checking Meta Pixel...</span>
                </>
              )}
              {pixelStatus === 'found' && (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="font-medium">Meta Pixel is installed and working!</span>
                </>
              )}
              {pixelStatus === 'not-found' && (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  <span className="font-medium">Meta Pixel not detected</span>
                </>
              )}
            </div>

            {/* Pixel Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Pixel Information</h3>
              <p className="text-sm text-gray-700">
                <strong>Pixel ID:</strong> 1220386713386327
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Status:</strong> {pixelStatus === 'found' ? 'Active' : 'Inactive'}
              </p>
            </div>

            {/* Test Events */}
            <div className="space-y-3">
              <h3 className="font-semibold">Test Events</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => testEvent('PageView')}
                  variant="outline"
                  disabled={pixelStatus !== 'found'}
                >
                  Test PageView
                </Button>
                <Button 
                  onClick={() => testEvent('ViewContent')}
                  variant="outline"
                  disabled={pixelStatus !== 'found'}
                >
                  Test ViewContent
                </Button>
                <Button 
                  onClick={() => testEvent('AddToCart')}
                  variant="outline"
                  disabled={pixelStatus !== 'found'}
                >
                  Test AddToCart
                </Button>
                <Button 
                  onClick={() => testEvent('InitiateCheckout')}
                  variant="outline"
                  disabled={pixelStatus !== 'found'}
                >
                  Test InitiateCheckout
                </Button>
              </div>
            </div>

            {/* Event Log */}
            <div className="space-y-2">
              <h3 className="font-semibold">Event Log</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-gray-500">No events yet...</p>
                ) : (
                  events.map((event, index) => (
                    <div key={index}>{event}</div>
                  ))
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-2">Testing Instructions</h3>
              <ol className="text-sm text-yellow-900 space-y-1 list-decimal list-inside">
                <li>Install Meta Pixel Helper Chrome extension</li>
                <li>Click the extension icon to see pixel details</li>
                <li>Open browser DevTools (F12) → Network tab</li>
                <li>Filter by "facebook" to see tracking requests</li>
                <li>Click the test buttons above to fire events</li>
                <li>Check the event log below for results</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
