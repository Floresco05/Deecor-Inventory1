import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Plus, Save, Upload, Download, Search, AlertCircle, Package2, ArrowRight, Trash2, 
  Edit, Calendar, TrendingUp, MapPin, Users, DollarSign, BarChart3, Settings, 
  QrCode, Bell, RefreshCw, Eye, Filter, Zap, Target, Archive, CheckCircle2,
  Clock, Activity, PieChart, LineChart, ShoppingCart, Truck, Star, Camera,
  FileSpreadsheet, Mail, Phone, Globe, AlertTriangle, TrendingDown, X
} from 'lucide-react';

const DeecorInventorySystem = () => {
  const [inventory, setInventory] = useState([
    {
      id: 'zb001',
      name: 'Z BEAM STANDARD',
      category: 'Structural Steel',
      subcategory: 'Beams',
      size: '200x100x8mm',
      length: '6000mm',
      location: 'Zone A-1-B3',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: 'pieces',
      costPerUnit: 156.50,
      supplier: 'Steel Works Ltd',
      barcode: 'ZB-STD-200-001',
      weight: 94.2,
      material: 'S355 Steel',
      dateAdded: '2024-01-15',
      lastUpdated: '2024-07-15',
      tags: ['high-demand', 'structural'],
      priority: 'high',
      image: null,
      notes: 'Standard structural beam for construction projects'
    },
    {
      id: 'zb002',
      name: 'Z BEAM HEAVY DUTY',
      category: 'Structural Steel',
      subcategory: 'Beams',
      size: '250x125x10mm',
      length: '6000mm',
      location: 'Zone A-1-B4',
      currentStock: 12,
      minStock: 15,
      maxStock: 60,
      unit: 'pieces',
      costPerUnit: 234.75,
      supplier: 'Steel Works Ltd',
      barcode: 'ZB-HD-250-001',
      weight: 147.3,
      material: 'S355 Steel',
      dateAdded: '2024-01-15',
      lastUpdated: '2024-07-20',
      tags: ['specialty', 'heavy-duty'],
      priority: 'critical',
      image: null,
      notes: 'Heavy duty beam for specialized applications'
    },
    {
      id: 'mt001',
      name: 'MOTOR ASSEMBLY 5HP',
      category: 'Mechanical Parts',
      subcategory: 'Motors',
      size: '300x200x150mm',
      length: 'N/A',
      location: 'Zone B-2-A1',
      currentStock: 8,
      minStock: 5,
      maxStock: 25,
      unit: 'pieces',
      costPerUnit: 1250.00,
      supplier: 'Mechanical Supply Co',
      barcode: 'MT-5HP-001',
      weight: 45.6,
      material: 'Cast Iron',
      dateAdded: '2024-02-10',
      lastUpdated: '2024-07-25',
      tags: ['electrical', 'motor'],
      priority: 'medium',
      image: null,
      notes: '5HP industrial motor for conveyor systems'
    }
  ]);

  const [categories, setCategories] = useState([
    { id: 'struct', name: 'Structural Steel', subcategories: ['Beams', 'Columns', 'Plates', 'Angles'], color: '#3B82F6' },
    { id: 'mech', name: 'Mechanical Parts', subcategories: ['Motors', 'Pumps', 'Valves', 'Bearings'], color: '#10B981' },
    { id: 'elect', name: 'Electrical', subcategories: ['Cables', 'Switches', 'Panels', 'Lights'], color: '#F59E0B' },
    { id: 'tools', name: 'Tools & Equipment', subcategories: ['Hand Tools', 'Power Tools', 'Measuring', 'Safety'], color: '#8B5CF6' },
    { id: 'raw', name: 'Raw Materials', subcategories: ['Metal Stock', 'Fasteners', 'Consumables', 'Chemicals'], color: '#EF4444' }
  ]);

  const [stockAdjustments, setStockAdjustments] = useState([
    { id: 'adj001', itemId: 'zb001', date: '2024-07-25', type: 'receipt', quantity: 25, reason: 'New delivery from Steel Works', adjusterName: 'John Smith', cost: 3912.50 },
    { id: 'adj002', itemId: 'zb001', date: '2024-07-20', type: 'issue', quantity: -5, reason: 'Used in Project Alpha', adjusterName: 'Mike Johnson', cost: -782.50 },
    { id: 'adj003', itemId: 'zb002', date: '2024-07-18', type: 'adjustment', quantity: -3, reason: 'Damage inspection - rejected', adjusterName: 'Sarah Wilson', cost: -704.25 }
  ]);

  const [orders, setOrders] = useState([
    { id: 'ord001', itemId: 'zb002', quantity: 30, supplier: 'Steel Works Ltd', status: 'pending', orderDate: '2024-07-28', expectedDate: '2024-08-05', cost: 7042.50 },
    { id: 'ord002', itemId: 'mt001', quantity: 10, supplier: 'Mechanical Supply Co', status: 'shipped', orderDate: '2024-07-25', expectedDate: '2024-08-01', cost: 12500.00 }
  ]);

  const [locations, setLocations] = useState([
    { id: 'zone-a', name: 'Zone A', description: 'Structural Materials', capacity: 500, currentUsage: 320 },
    { id: 'zone-b', name: 'Zone B', description: 'Mechanical Components', capacity: 200, currentUsage: 145 },
    { id: 'zone-c', name: 'Zone C', description: 'Electrical & Tools', capacity: 300, currentUsage: 220 }
  ]);

  // UI State
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Form states
  const [newItem, setNewItem] = useState({
    name: '', category: '', subcategory: '', size: '', length: '',
    location: '', currentStock: 0, minStock: 0, maxStock: 0, unit: 'pieces',
    costPerUnit: 0, supplier: '', barcode: '', weight: 0, material: '',
    tags: '', priority: 'medium', notes: ''
  });
  const [editingItem, setEditingItem] = useState(null);
  const [newAdjustment, setNewAdjustment] = useState({
    itemId: '', date: new Date().toISOString().split('T')[0],
    type: 'receipt', quantity: 0, reason: '', adjusterName: '', cost: 0
  });
  const [newCategory, setNewCategory] = useState({ name: '', subcategories: '', color: '#3B82F6' });
  const [newOrder, setNewOrder] = useState({
    itemId: '', quantity: 0, supplier: '', expectedDate: '', cost: 0
  });

  // Enhanced stock status calculation
  const getStockStatus = (item) => {
    const stockRatio = item.currentStock / item.maxStock;
    const minRatio = item.currentStock / item.minStock;
    
    if (item.currentStock === 0) return { 
      status: 'out-of-stock', 
      color: 'text-black', 
      bg: 'bg-black/10', 
      icon: AlertTriangle,
      priority: 'critical'
    };
    if (item.currentStock <= item.minStock) return { 
      status: 'critical', 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      icon: AlertCircle,
      priority: 'critical'
    };
    if (item.currentStock <= item.minStock * 1.5) return { 
      status: 'low', 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      icon: TrendingDown,
      priority: 'high'
    };
    if (stockRatio >= 0.9) return { 
      status: 'overstocked', 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      icon: TrendingUp,
      priority: 'low'
    };
    return { 
      status: 'normal', 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      icon: CheckCircle2,
      priority: 'normal'
    };
  };

  // Enhanced filtering and sorting
  const filteredAndSortedInventory = useMemo(() => {
    let filtered = inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !filterCategory || item.category === filterCategory;
      const matchesLowStock = !showLowStock || ['critical', 'low', 'out-of-stock'].includes(getStockStatus(item).status);
      
      return matchesSearch && matchesCategory && matchesLowStock;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'stock':
          aValue = a.currentStock;
          bValue = b.currentStock;
          break;
        case 'value':
          aValue = a.currentStock * a.costPerUnit;
          bValue = b.currentStock * b.costPerUnit;
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        case 'priority':
          const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
          aValue = priorityOrder[a.priority] || 1;
          bValue = priorityOrder[b.priority] || 1;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [inventory, searchQuery, filterCategory, showLowStock, sortBy, sortOrder]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
    const criticalItems = inventory.filter(item => getStockStatus(item).status === 'critical');
    const lowStockItems = inventory.filter(item => ['critical', 'low', 'out-of-stock'].includes(getStockStatus(item).status));
    const overstockedItems = inventory.filter(item => getStockStatus(item).status === 'overstocked');
    
    const categoryBreakdown = categories.map(cat => ({
      ...cat,
      itemCount: inventory.filter(item => item.category === cat.name).length,
      value: inventory.filter(item => item.category === cat.name).reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0)
    }));

    const topValueItems = [...inventory].sort((a, b) => (b.currentStock * b.costPerUnit) - (a.currentStock * a.costPerUnit)).slice(0, 5);
    
    const recentActivity = stockAdjustments.slice(0, 10).map(adj => ({
      ...adj,
      item: inventory.find(item => item.id === adj.itemId)
    }));

    return {
      totalValue,
      totalItems: inventory.length,
      criticalItems: criticalItems.length,
      lowStockItems: lowStockItems.length,
      overstockedItems: overstockedItems.length,
      categoryBreakdown,
      topValueItems,
      recentActivity,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      totalOrderValue: orders.reduce((sum, order) => sum + order.cost, 0)
    };
  }, [inventory, stockAdjustments, orders, categories]);

  // Enhanced add item function
  const addNewItem = () => {
    const newId = `item_${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const tags = newItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    setInventory([...inventory, {
      ...newItem,
      id: newId,
      tags,
      dateAdded: now,
      lastUpdated: now
    }]);
    resetNewItem();
    setShowModal(null);
  };

  const resetNewItem = () => {
    setNewItem({
      name: '', category: '', subcategory: '', size: '', length: '',
      location: '', currentStock: 0, minStock: 0, maxStock: 0, unit: 'pieces',
      costPerUnit: 0, supplier: '', barcode: '', weight: 0, material: '',
      tags: '', priority: 'medium', notes: ''
    });
  };

  // Add stock adjustment
  const addStockAdjustment = () => {
    const newId = `adj_${Date.now()}`;
    const adjustment = {
      ...newAdjustment,
      id: newId
    };
    
    setStockAdjustments([adjustment, ...stockAdjustments]);
    
    // Update item stock
    setInventory(prev => prev.map(item => {
      if (item.id === newAdjustment.itemId) {
        return {
          ...item,
          currentStock: Math.max(0, item.currentStock + newAdjustment.quantity),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
    
    setNewAdjustment({
      itemId: '', date: new Date().toISOString().split('T')[0],
      type: 'receipt', quantity: 0, reason: '', adjusterName: '', cost: 0
    });
    setShowModal(null);
  };

  // Delete item
  const deleteItem = (itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
    setSelectedItem(null);
  };

  // Category management
  const addCategory = () => {
    const newId = `cat_${Date.now()}`;
    const subcategories = newCategory.subcategories.split(',').map(sub => sub.trim()).filter(sub => sub);
    
    setCategories([...categories, {
      ...newCategory,
      id: newId,
      subcategories
    }]);
    setNewCategory({ name: '', subcategories: '', color: '#3B82F6' });
    setShowModal(null);
  };

  const updateCategory = (categoryId, updates) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, ...updates } : cat
    ));
    setEditingCategory(null);
  };

  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  // Bulk operations
  const bulkUpdateStock = (adjustment) => {
    setInventory(prev => prev.map(item => {
      if (selectedItems.includes(item.id)) {
        return {
          ...item,
          currentStock: Math.max(0, item.currentStock + adjustment),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
    setSelectedItems([]);
  };

  const bulkDelete = () => {
    setInventory(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  // Export enhanced data
  const exportData = (format = 'json') => {
    const data = {
      inventory,
      categories,
      stockAdjustments,
      orders,
      locations,
      analytics,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deecor_inventory_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else if (format === 'csv') {
      const csvData = inventory.map(item => ({
        ID: item.id,
        Name: item.name,
        Category: item.category,
        'Current Stock': item.currentStock,
        'Min Stock': item.minStock,
        'Max Stock': item.maxStock,
        Unit: item.unit,
        'Cost per Unit': item.costPerUnit,
        'Total Value': item.currentStock * item.costPerUnit,
        Location: item.location,
        Supplier: item.supplier,
        'Last Updated': item.lastUpdated,
        Status: getStockStatus(item).status
      }));
      
      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deecor_inventory_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  // Generate QR code for item
  const generateQRCode = (item) => {
    const qrData = JSON.stringify({
      id: item.id,
      name: item.name,
      barcode: item.barcode,
      location: item.location
    });
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Package2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Deecor Inventory Management
                </h1>
                <p className="text-gray-600">Complete inventory control & tracking</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-6 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Total Value</div>
                  <div className="text-sm font-bold text-green-600">${analytics.totalValue.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Critical Items</div>
                  <div className="text-sm font-bold text-red-600">{analytics.criticalItems}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Pending Orders</div>
                  <div className="text-sm font-bold text-blue-600">{analytics.pendingOrders}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowModal('addItem')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowModal('export')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Announcement */}
          {showAnnouncement && analytics.criticalItems > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-red-800">Inventory Alert</span>
                    <p className="text-red-700 text-sm">
                      {analytics.criticalItems} items need immediate attention. Stock levels are below minimum requirements.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors shadow-md"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setShowAnnouncement(false)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Navigation Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
                { id: 'inventory', name: 'Inventory', icon: Package2 },
                { id: 'orders', name: 'Orders', icon: ShoppingCart },
                { id: 'adjustments', name: 'Adjustments', icon: Calendar },
                { id: 'categories', name: 'Categories', icon: Settings },
                { id: 'locations', name: 'Locations', icon: MapPin },
                { id: 'analytics', name: 'Analytics', icon: TrendingUp }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Items</p>
                    <p className="text-3xl font-bold">{analytics.totalItems}</p>
                    <p className="text-blue-100 text-xs mt-1">Active inventory</p>
                  </div>
                  <div className="p-3 bg-blue-400/30 rounded-lg">
                    <Package2 className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Value</p>
                    <p className="text-3xl font-bold">${(analytics.totalValue / 1000).toFixed(0)}K</p>
                    <p className="text-green-100 text-xs mt-1">Current valuation</p>
                  </div>
                  <div className="p-3 bg-green-400/30 rounded-lg">
                    <DollarSign className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Critical Items</p>
                    <p className="text-3xl font-bold">{analytics.criticalItems}</p>
                    <p className="text-red-100 text-xs mt-1">Need restocking</p>
                  </div>
                  <div className="p-3 bg-red-400/30 rounded-lg">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Pending Orders</p>
                    <p className="text-3xl font-bold">{analytics.pendingOrders}</p>
                    <p className="text-purple-100 text-xs mt-1">${(analytics.totalOrderValue / 1000).toFixed(0)}K value</p>
                  </div>
                  <div className="p-3 bg-purple-400/30 rounded-lg">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Charts and Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Breakdown */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                  Inventory by Category
                </h3>
                <div className="space-y-4">
                  {analytics.categoryBreakdown.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <div>
                          <div className="font-medium">{cat.name}</div>
                          <div className="text-sm text-gray-500">{cat.itemCount} items</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">${cat.value.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {((cat.value / analytics.totalValue) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Value Items */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  Top Value Items
                </h3>
                <div className="space-y-3">
                  {analytics.topValueItems.map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm truncate">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.currentStock} {item.unit}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600 text-sm">
                          ${(item.currentStock * item.costPerUnit).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {analytics.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'receipt' ? 'bg-green-100 text-green-600' :
                        activity.type === 'issue' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {activity.type === 'receipt' ? '+' : activity.type === 'issue' ? '-' : '~'}
                      </div>
                      <div>
                        <div className="font-medium">{activity.item?.name || 'Unknown Item'}</div>
                        <div className="text-sm text-gray-600">{activity.reason}</div>
                        <div className="text-xs text-gray-500">{activity.date} by {activity.adjusterName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${activity.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {activity.quantity > 0 ? '+' : ''}{activity.quantity}
                      </div>
                      <div className="text-xs text-gray-500">
                        ${Math.abs(activity.cost || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Enhanced Filters and Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items, locations, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>

                  {/* Sort Options */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="stock">Sort by Stock</option>
                    <option value="value">Sort by Value</option>
                    <option value="lastUpdated">Sort by Last Updated</option>
                    <option value="priority">Sort by Priority</option>
                  </select>

                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Filters */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showLowStock}
                      onChange={(e) => setShowLowStock(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Low stock only</span>
                  </label>

                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      Table
                    </button>
                  </div>

                  {/* Bulk Actions */}
                  {selectedItems.length > 0 && (
                    <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                      <span className="text-sm text-blue-700">{selectedItems.length} selected</span>
                      <button
                        onClick={() => setShowModal('bulkEdit')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={bulkDelete}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inventory Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedInventory.map(item => {
                  const stockStatus = getStockStatus(item);
                  const IconComponent = stockStatus.icon;
                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                        selectedItem?.id === item.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
                      } ${stockStatus.bg}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="p-6">
                        {/* Item Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (e.target.checked) {
                                    setSelectedItems([...selectedItems, item.id]);
                                  } else {
                                    setSelectedItems(selectedItems.filter(id => id !== item.id));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{item.size} - {item.location}</p>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                                {item.category}
                              </span>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                item.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                item.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.priority}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <IconComponent className={`w-5 h-5 ${stockStatus.color} mb-1`} />
                            <span className="text-xs text-gray-500">#{item.barcode.slice(-4)}</span>
                          </div>
                        </div>

                        {/* Stock Information */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Stock:</span>
                            <span className={`font-semibold ${stockStatus.color}`}>
                              {item.currentStock} {item.unit}
                            </span>
                          </div>
                          
                          {/* Stock Level Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                item.currentStock <= item.minStock ? 'bg-red-500' :
                                item.currentStock <= item.minStock * 1.5 ? 'bg-orange-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Min: {item.minStock}</span>
                            <span>Max: {item.maxStock}</span>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-sm text-gray-600">Value:</span>
                            <span className="font-semibold text-green-600">
                              ${(item.currentStock * item.costPerUnit).toLocaleString()}
                            </span>
                          </div>

                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-2">
                              {item.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 2 && (
                                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{item.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Table View */
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedItems.length === filteredAndSortedInventory.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems(filteredAndSortedInventory.map(item => item.id));
                              } else {
                                setSelectedItems([]);
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedInventory.map(item => {
                        const stockStatus = getStockStatus(item);
                        const IconComponent = stockStatus.icon;
                        return (
                          <tr 
                            key={item.id} 
                            className={`hover:bg-gray-50 cursor-pointer ${selectedItem?.id === item.id ? 'bg-blue-50' : ''}`}
                            onClick={() => setSelectedItem(item)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (e.target.checked) {
                                    setSelectedItems([...selectedItems, item.id]);
                                  } else {
                                    setSelectedItems(selectedItems.filter(id => id !== item.id));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  <div className="text-sm text-gray-500">{item.size}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.currentStock} {item.unit}</div>
                              <div className="text-sm text-gray-500">Min: {item.minStock} | Max: {item.maxStock}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              ${(item.currentStock * item.costPerUnit).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <IconComponent className={`w-4 h-4 ${stockStatus.color}`} />
                                <span className={`text-sm ${stockStatus.color} capitalize`}>
                                  {stockStatus.status.replace('-', ' ')}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingItem({...item});
                                    setShowModal('editItem');
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowModal('qrCode');
                                    setSelectedItem(item);
                                  }}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <QrCode className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Are you sure you want to delete this item?')) {
                                      deleteItem(item.id);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Item Details Panel */}
            {selectedItem && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                    {selectedItem.name}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingItem({...selectedItem});
                        setShowModal('editItem');
                      }}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setNewAdjustment({...newAdjustment, itemId: selectedItem.id});
                        setShowModal('addAdjustment');
                      }}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adjust Stock</span>
                    </button>
                    <button
                      onClick={() => setShowModal('qrCode')}
                      className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>QR Code</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this item?')) {
                          deleteItem(selectedItem.id);
                        }
                      }}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Package2 className="w-4 h-4 mr-2 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedItem.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subcategory:</span>
                        <span className="font-medium">{selectedItem.subcategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{selectedItem.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedItem.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-medium">{selectedItem.material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{selectedItem.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Supplier:</span>
                        <span className="font-medium">{selectedItem.supplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className={`font-medium capitalize ${
                          selectedItem.priority === 'critical' ? 'text-red-600' :
                          selectedItem.priority === 'high' ? 'text-orange-600' :
                          selectedItem.priority === 'medium' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {selectedItem.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Stock:</span>
                        <span className={`font-semibold ${getStockStatus(selectedItem).color}`}>
                          {selectedItem.currentStock} {selectedItem.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Value:</span>
                        <span className="font-semibold text-green-600">
                          ${(selectedItem.currentStock * selectedItem.costPerUnit).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {selectedItem.tags && selectedItem.tags.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm text-gray-600 mb-2">Tags:</div>
                        <div className="flex flex-wrap gap-1">
                          {selectedItem.tags.map(tag => (
                            <span key={tag} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedItem.notes && (
                      <div className="mt-4">
                        <div className="text-sm text-gray-600 mb-2">Notes:</div>
                        <div className="text-sm text-gray-900 bg-white p-3 rounded border">
                          {selectedItem.notes}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stock Level Visualization */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-purple-600" />
                      Stock Level Analysis
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Min Stock:</span>
                        <span className="font-medium">{selectedItem.minStock}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Max Stock:</span>
                        <span className="font-medium">{selectedItem.maxStock}</span>
                      </div>
                    </div>

                    {/* Enhanced Stock Level Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>0</span>
                        <span className="text-orange-600">Min: {selectedItem.minStock}</span>
                        <span>{selectedItem.maxStock}</span>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-6">
                        {/* Min stock indicator */}
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-orange-400 z-10"
                          style={{ left: `${(selectedItem.minStock / selectedItem.maxStock) * 100}%` }}
                        ></div>
                        {/* Current stock bar */}
                        <div
                                                    className={`h-6 rounded-full transition-all duration-300 ${
                            selectedItem.currentStock <= selectedItem.minStock ? 'bg-red-500' :
                            selectedItem.currentStock <= selectedItem.minStock * 1.5 ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((selectedItem.currentStock / selectedItem.maxStock) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-xs text-gray-600">
                          {((selectedItem.currentStock / selectedItem.maxStock) * 100).toFixed(1)}% capacity
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} {/* end Item Details Panel */}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(o => {
                      const it = inventory.find(i => i.id === o.itemId);
                      return (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{o.id.toUpperCase()}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{it?.name || o.itemId}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{o.quantity}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{o.supplier}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              o.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{o.expectedDate}</td>
                          <td className="px-6 py-4 text-sm font-medium text-green-600">${o.cost.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Adjustments Tab */}
        {activeTab === 'adjustments' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal('addAdjustment')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                New Adjustment
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjuster</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockAdjustments.map(adj => {
                      const it = inventory.find(i => i.id === adj.itemId);
                      return (
                        <tr key={adj.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{adj.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{it?.name || adj.itemId}</td>
                          <td className="px-6 py-4 text-sm capitalize">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              adj.type === 'receipt' ? 'bg-green-100 text-green-800' :
                              adj.type === 'issue' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {adj.type}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-sm ${adj.quantity >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {adj.quantity > 0 ? '+' : ''}{adj.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{adj.reason}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{adj.adjusterName}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">${Math.abs(adj.cost || 0).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal('addCategory')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                New Category
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white rounded-xl shadow p-4">
                  {editingCategory === cat.id ? (
                    <CategoryEditor
                      initial={cat}
                      onCancel={() => setEditingCategory(null)}
                      onSave={(updates) => updateCategory(cat.id, updates)}
                      onDelete={() => deleteCategory(cat.id)}
                    />
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <h3 className="font-semibold">{cat.name}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingCategory(cat.id)} className="px-2 py-1 border rounded">Edit</button>
                          <button onClick={() => deleteCategory(cat.id)} className="px-2 py-1 border rounded hover:bg-red-50">Delete</button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {cat.subcategories.map(sub => (
                          <span key={sub} className="px-2 py-1 text-xs border rounded">{sub}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === 'locations' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {locations.map(loc => (
                      <tr key={loc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{loc.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{loc.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{loc.capacity}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{loc.currentUsage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <LineChart className="w-5 h-5 mr-2 text-blue-600" />
                Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Stat label="Total Items" value={analytics.totalItems} />
                <Stat label="Low/Near Min" value={analytics.lowStockItems} />
                <Stat label="Overstocked" value={analytics.overstockedItems} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                Category Value Share
              </h3>
              <div className="space-y-3">
                {analytics.categoryBreakdown.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      ${cat.value.toLocaleString()} • {((cat.value / (analytics.totalValue || 1)) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== Modals ===== */}
      {showModal === 'addItem' && (
        <Modal title="Add Item" onClose={() => setShowModal(null)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Name" value={newItem.name} onChange={v => setNewItem({ ...newItem, name: v })} />
            <Input label="Category" value={newItem.category} onChange={v => setNewItem({ ...newItem, category: v })} />
            <Input label="Subcategory" value={newItem.subcategory} onChange={v => setNewItem({ ...newItem, subcategory: v })} />
            <Input label="Size" value={newItem.size} onChange={v => setNewItem({ ...newItem, size: v })} />
            <Input label="Length" value={newItem.length} onChange={v => setNewItem({ ...newItem, length: v })} />
            <Input label="Location" value={newItem.location} onChange={v => setNewItem({ ...newItem, location: v })} />
            <Number label="Current Stock" value={newItem.currentStock} onChange={v => setNewItem({ ...newItem, currentStock: v })} />
            <Number label="Min Stock" value={newItem.minStock} onChange={v => setNewItem({ ...newItem, minStock: v })} />
            <Number label="Max Stock" value={newItem.maxStock} onChange={v => setNewItem({ ...newItem, maxStock: v })} />
            <Input label="Unit" value={newItem.unit} onChange={v => setNewItem({ ...newItem, unit: v })} />
            <Number label="Cost per Unit" value={newItem.costPerUnit} onChange={v => setNewItem({ ...newItem, costPerUnit: v })} />
            <Input label="Supplier" value={newItem.supplier} onChange={v => setNewItem({ ...newItem, supplier: v })} />
            <Input label="Barcode" value={newItem.barcode} onChange={v => setNewItem({ ...newItem, barcode: v })} />
            <Number label="Weight (kg)" value={newItem.weight} onChange={v => setNewItem({ ...newItem, weight: v })} />
            <Input label="Material" value={newItem.material} onChange={v => setNewItem({ ...newItem, material: v })} />
            <Input label="Tags (comma-separated)" value={newItem.tags} onChange={v => setNewItem({ ...newItem, tags: v })} />
            <Input label="Priority (critical/high/medium/low)" value={newItem.priority} onChange={v => setNewItem({ ...newItem, priority: v })} />
            <Textarea label="Notes" value={newItem.notes} onChange={v => setNewItem({ ...newItem, notes: v })} className="md:col-span-2" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowModal(null)} className="px-3 py-2 border rounded">Cancel</button>
            <button onClick={addNewItem} className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </Modal>
      )}

      {showModal === 'editItem' && editingItem && (
        <Modal title="Edit Item" onClose={() => setShowModal(null)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Name" value={editingItem.name} onChange={v => setEditingItem({ ...editingItem, name: v })} />
            <Input label="Category" value={editingItem.category} onChange={v => setEditingItem({ ...editingItem, category: v })} />
            <Input label="Subcategory" value={editingItem.subcategory} onChange={v => setEditingItem({ ...editingItem, subcategory: v })} />
            <Input label="Location" value={editingItem.location} onChange={v => setEditingItem({ ...editingItem, location: v })} />
            <Number label="Min Stock" value={editingItem.minStock} onChange={v => setEditingItem({ ...editingItem, minStock: v })} />
            <Number label="Max Stock" value={editingItem.maxStock} onChange={v => setEditingItem({ ...editingItem, maxStock: v })} />
            <Number label="Cost per Unit" value={editingItem.costPerUnit} onChange={v => setEditingItem({ ...editingItem, costPerUnit: v })} />
            <Input label="Priority" value={editingItem.priority} onChange={v => setEditingItem({ ...editingItem, priority: v })} />
            <Textarea label="Notes" value={editingItem.notes || ''} onChange={v => setEditingItem({ ...editingItem, notes: v })} className="md:col-span-2" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowModal(null)} className="px-3 py-2 border rounded">Cancel</button>
            <button
              onClick={() => {
                setInventory(prev => prev.map(it => it.id === editingItem.id ? { ...editingItem, lastUpdated: new Date().toISOString().split('T')[0] } : it));
                setShowModal(null);
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {showModal === 'addAdjustment' && (
        <Modal title="New Stock Adjustment" onClose={() => setShowModal(null)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={newAdjustment.itemId}
              onChange={e => setNewAdjustment({ ...newAdjustment, itemId: e.target.value })}
              className="px-3 py-2 border rounded"
            >
              <option value="">Select Item</option>
              {inventory.map(it => <option key={it.id} value={it.id}>{it.name}</option>)}
            </select>
            <select
              value={newAdjustment.type}
              onChange={e => setNewAdjustment({ ...newAdjustment, type: e.target.value })}
              className="px-3 py-2 border rounded"
            >
              <option value="receipt">receipt</option>
              <option value="issue">issue</option>
              <option value="adjustment">adjustment</option>
            </select>
            <Number label="Quantity" value={newAdjustment.quantity} onChange={v => setNewAdjustment({ ...newAdjustment, quantity: v })} />
            <Number label="Cost (optional)" value={newAdjustment.cost} onChange={v => setNewAdjustment({ ...newAdjustment, cost: v })} />
            <Input label="Adjuster Name" value={newAdjustment.adjusterName} onChange={v => setNewAdjustment({ ...newAdjustment, adjusterName: v })} />
            <Input label="Date" value={newAdjustment.date} onChange={v => setNewAdjustment({ ...newAdjustment, date: v })} />
            <Textarea label="Reason" value={newAdjustment.reason} onChange={v => setNewAdjustment({ ...newAdjustment, reason: v })} className="md:col-span-2" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowModal(null)} className="px-3 py-2 border rounded">Cancel</button>
            <button onClick={addStockAdjustment} className="px-3 py-2 bg-green-600 text-white rounded">Save</button>
          </div>
        </Modal>
      )}

      {showModal === 'addCategory' && (
        <Modal title="Add Category" onClose={() => setShowModal(null)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Name" value={newCategory.name} onChange={v => setNewCategory({ ...newCategory, name: v })} />
            <Input label="Color (hex)" value={newCategory.color} onChange={v => setNewCategory({ ...newCategory, color: v })} />
            <Textarea label="Subcategories (comma-separated)" value={newCategory.subcategories} onChange={v => setNewCategory({ ...newCategory, subcategories: v })} className="md:col-span-2" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowModal(null)} className="px-3 py-2 border rounded">Cancel</button>
            <button onClick={addCategory} className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </Modal>
      )}

      {showModal === 'export' && (
        <Modal title="Export Data" onClose={() => setShowModal(null)}>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Choose a format to export your current data snapshot.</p>
            <div className="flex gap-2">
              <button onClick={() => exportData('json')} className="px-4 py-2 bg-gray-900 text-white rounded">Export JSON</button>
              <button onClick={() => exportData('csv')} className="px-4 py-2 bg-gray-100 border rounded">Export CSV</button>
            </div>
          </div>
        </Modal>
      )}

      {showModal === 'qrCode' && selectedItem && (
        <Modal title={`QR Code — ${selectedItem.name}`} onClose={() => setShowModal(null)}>
          <div className="flex flex-col items-center gap-3">
            <img src={generateQRCode(selectedItem)} alt="QR Code" className="w-48 h-48 border rounded" />
            <p className="text-xs text-gray-600">Scan to view item details (id, name, barcode, location)</p>
          </div>
        </Modal>
      )}

      {showModal === 'bulkEdit' && (
        <Modal title="Bulk Stock Update" onClose={() => setShowModal(null)}>
          <div className="space-y-3">
            <Number
              label={`Adjust stock by (applies to ${selectedItems.length} selected)`}
              value={0}
              onChange={() => {}}
              disabled
            />
            <p className="text-sm text-gray-600">Use quick actions below:</p>
            <div className="flex gap-2">
              <button onClick={() => { bulkUpdateStock(1); setShowModal(null); }} className="px-3 py-2 border rounded">+1 each</button>
              <button onClick={() => { bulkUpdateStock(-1); setShowModal(null); }} className="px-3 py-2 border rounded">-1 each</button>
              <button onClick={() => { bulkDelete(); setShowModal(null); }} className="px-3 py-2 border rounded text-red-600">Delete selected</button>
            </div>
          </div>
        </Modal>
      )}
      {/* ===== End Modals ===== */}
    </div>
  );
};

/** Reusable UI bits (fixed JS versions) */

// Modal
const Modal = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="text-lg font-semibold">{title}</h4>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, className = "" }) => {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        className="w-full px-3 py-2 border rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
};

const Number = ({ label, value, onChange, disabled = false, className = "" }) => {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        type="number"
        className="w-full px-3 py-2 border rounded"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
};

const Textarea = ({ label, value, onChange, className = "" }) => {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <textarea
        className="w-full px-3 py-2 border rounded min-h-[100px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
};

const Stat = ({ label, value }) => {
  return (
    <div className="p-4 border rounded-lg flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
};

const CategoryEditor = ({ initial, onCancel, onSave, onDelete }) => {
  const [name, setName] = React.useState(initial.name);
  const [color, setColor] = React.useState(initial.color);
  const [subs, setSubs] = React.useState(initial.subcategories.join(", "));

  return (
    <div className="space-y-3">
      <Input label="Name" value={name} onChange={setName} />
      <Input label="Color (hex)" value={color} onChange={setColor} />
      <Textarea
        label="Subcategories (comma-separated)"
        value={subs}
        onChange={setSubs}
      />
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-2 border rounded">Cancel</button>
        <button
          onClick={() =>
            onSave({
              name,
              color,
              subcategories: subs.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
        <button onClick={onDelete} className="px-3 py-2 border rounded text-red-600">
          Delete
        </button>
      </div>
    </div>
  );
};

// Keep this at the very end of the file:
export default DeecorInventorySystem; 