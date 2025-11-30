'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Tag, Users, TrendingUp, RefreshCw } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  influencer_name: string | null;
  usage_count: number;
  max_usage: number | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discount_type: 'percentage',
    discount_value: '',
    influencer_name: '',
    max_usage: '',
    expires_at: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons');
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = '/api/coupons';
      const method = editingCoupon ? 'PATCH' : 'POST';
      const body = editingCoupon
        ? { id: editingCoupon.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to save coupon');
        return;
      }

      await fetchCoupons();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Failed to save coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(`/api/coupons?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      await fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      const response = await fetch('/api/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: coupon.id,
          is_active: !coupon.is_active,
        }),
      });

      if (!response.ok) throw new Error('Failed to update');

      await fetchCoupons();
    } catch (error) {
      console.error('Error updating coupon:', error);
      alert('Failed to update coupon');
    }
  };

  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      influencer_name: coupon.influencer_name || '',
      max_usage: coupon.max_usage?.toString() || '',
      expires_at: coupon.expires_at
        ? new Date(coupon.expires_at).toISOString().split('T')[0]
        : '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      name: '',
      discount_type: 'percentage',
      discount_value: '',
      influencer_name: '',
      max_usage: '',
      expires_at: '',
    });
  };

  const totalUsage = coupons.reduce((sum, c) => sum + c.usage_count, 0);
  const activeCoupons = coupons.filter((c) => c.is_active).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-600">Create and manage discount codes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="SUMMER20"
                  required
                  className="uppercase"
                />
              </div>

              <div>
                <Label htmlFor="name">Display Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Summer Sale"
                  required
                />
              </div>

              <div>
                <Label htmlFor="discount_type">Discount Type *</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, discount_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (DH)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discount_value">
                  Discount Value * ({formData.discount_type === 'percentage' ? '%' : 'DH'})
                </Label>
                <Input
                  id="discount_value"
                  type="number"
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_value: e.target.value })
                  }
                  placeholder={formData.discount_type === 'percentage' ? '10' : '50'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="influencer_name">Influencer Name (Optional)</Label>
                <Input
                  id="influencer_name"
                  value={formData.influencer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, influencer_name: e.target.value })
                  }
                  placeholder="Toji"
                />
              </div>

              <div>
                <Label htmlFor="max_usage">Max Usage (Optional)</Label>
                <Input
                  id="max_usage"
                  type="number"
                  value={formData.max_usage}
                  onChange={(e) =>
                    setFormData({ ...formData, max_usage: e.target.value })
                  }
                  placeholder="100"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
              </div>

              <div>
                <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) =>
                    setFormData({ ...formData, expires_at: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingCoupon ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Coupons</p>
                <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Coupons</p>
                <p className="text-2xl font-bold text-gray-900">{activeCoupons}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No coupons yet. Create your first coupon!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="text-lg font-bold bg-gray-100 px-3 py-1 rounded">
                        {coupon.code}
                      </code>
                      <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {coupon.influencer_name && (
                        <Badge variant="outline">
                          <Users className="h-3 w-3 mr-1" />
                          {coupon.influencer_name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{coupon.name}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>
                        Discount:{' '}
                        <span className="font-semibold text-green-600">
                          {coupon.discount_type === 'percentage'
                            ? `${coupon.discount_value}%`
                            : `${coupon.discount_value} DH`}
                        </span>
                      </span>
                      <span>
                        Used: <span className="font-semibold">{coupon.usage_count}</span>
                        {coupon.max_usage && ` / ${coupon.max_usage}`}
                      </span>
                      {coupon.expires_at && (
                        <span>
                          Expires:{' '}
                          {new Date(coupon.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(coupon)}
                    >
                      {coupon.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(coupon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
