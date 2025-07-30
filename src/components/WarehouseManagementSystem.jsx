import React, { useState, useRef, useEffect } from 'react';
import { Plus, Save, Upload, Download, Search, AlertCircle, Package2, ArrowRight, Trash2, Edit, Calendar, TrendingUp, MapPin, Users, DollarSign, BarChart3, Settings, QrCode, Bell, RefreshCw } from 'lucide-react';

const WarehouseManagementSystem = () => {
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
      lastUpdated: '2024-07-15'
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
      lastUpdated: '2024-07-20'
    }
  ]);

  const [categories, setCategories] = useState([
    { id: 'struct', name: 'Structural Steel', subcategories: ['Beams', 'Columns', 'Plates', 'Angles'] },
    { id: 'mech', name: 'Mechanical Parts', subcategories: ['Motors', 'Pumps', 'Valves', 'Bearings'] },
    { id: 'elect', name: 'Electrical', subcategories: ['Cables', 'Switches', 'Panels', 'Lights'] },
    { id: 'tools', name: 'Tools & Equipment', subcategories: ['Hand Tools', 'Power Tools', 'Measuring', 'Safety'] },
    { id: 'raw', name: 'Raw Materials', subcategories: ['Metal Stock', 'Fasteners', 'Consumables', 'Chemicals'] }
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: 'sw001', name: 'Steel Works Ltd', contact: 'john@steelworks.com', phone: '+1-555-0101' },
    { id: 'me002', name: 'Mechanical Supply Co', contact: 'sales@mechsupply.com', phone: '+1-555-0102' },
    { id: 'el003', name: 'ElectroTech Solutions', contact: 'orders@electrotech.com', phone: '+1-555-0103' }
  ]);

  const [stockAdjustments, setStockAdjustments] = useState([
    { id: 'adj001', itemId: 'zb001', date: '2024-07-25', type: 'receipt', quantity: 25, reason: 'New delivery from Steel Works', user: 'John Smith' },
    { id: 'adj002', itemId: 'zb001', date: '2024-07-20', type: 'issue', quantity: -5, reason: 'Used in Project Alpha', user: 'Mike Johnson' },
    { id: 'adj003', itemId: 'zb002', date: '2024-07-18', type: 'adjustment', quantity: -3, reason: 'Damage inspection - rejected', user: 'Sarah Wilson' }
  ]);

  const [dependencies, setDependencies] = useState([
    { from: 'zb001', to: 'frame001', quantity: 4, unit: 'beams per frame' },
    { from: 'zb002', to: 'support001', quantity: 2, unit: 'beams per support' }
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const [showModal, setShowModal] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '', category: '', subcategory: '', size: '', length: '',
    location: '', currentStock: 0, minStock: 0, maxStock: 0, unit: 'pieces',
    costPerUnit: 0, supplier: '', barcode: '', weight: 0, material: ''
  });

  const [editingItem, setEditingItem] = useState(null);
  const [newAdjustment, setNewAdjustment] = useState({
    itemId: '', date: new Date().toISOString().split('T')[0], 
    type: 'receipt', quantity: 0, reason: '', user: 'Current User'
  });

  const [newCategory, setNewCategory] = useState({ name: '', subcategories: '' });
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', phone: '' });

  // Get stock status with enhanced logic
  const getStockStatus = (item) => {
    const stockRatio = item.currentStock / item.maxStock;
    if (item.currentStock <= item.minStock) return { status: 'critical', color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle };
    if (item.currentStock <= item.minStock * 1.2) return { status: 'low', color: 'text-orange-600', bg: 'bg-orange-50', icon: TrendingUp };
    if (stockRatio >= 0.9) return { status: 'high', color: 'text-blue-600', bg: 'bg-blue-50', icon: BarChart3 };
    return { status: 'normal', color: 'text-green-600', bg: 'bg-green-50', icon: Package2 };
  };

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.barcode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || item.category === filterCategory;
    const matchesLowStock = !showLowStock || getStockStatus(item).status === 'critical' || getStockStatus(item).status === 'low';
    
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  // Get critical items for alerts
  const criticalItems = inventory.filter(item => getStockStatus(item).status === 'critical');
  const lowStockItems = inventory.filter(item => ['critical', 'low'].includes(getStockStatus(item).status));

  // Calculate total inventory value
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);

  // Add new item
  const addNewItem = () => {
    const newId = `item_${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    setInventory([...inventory, { 
      ...newItem, 
      id: newId, 
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
      costPerUnit: 0, supplier: '', barcode: '', weight: 0, material: ''
    });
  };

  // Edit item
  const saveEditedItem = () => {
    setInventory(inventory.map(item => 
      item.id === editingItem.id ? { 
        ...editingItem, 
        lastUpdated: new Date().toISOString().split('T')[0] 
      } : item
    ));
    setEditingItem(null);
    setShowModal(null);
    if (selectedItem?.id === editingItem.id) {
      setSelectedItem(editingItem);
    }
  };

  // Stock adjustment
  const addStockAdjustment = () => {
    const newId = `adj_${Date.now()}`;
    const adjustment = { ...newAdjustment, id: newId };
    setStockAdjustments([adjustment, ...stockAdjustments]);
    
    // Update inventory
    setInventory(inventory.map(item => {
      if (item.id === adjustment.itemId) {
        const newStock = Math.max(0, item.currentStock + adjustment.quantity);
        return { 
          ...item, 
          currentStock: newStock, 
          lastUpdated: adjustment.date 
        };
      }
      return item;
    }));
    
    setNewAdjustment({
      itemId: '', date: new Date().toISOString().split('T')[0], 
      type: 'receipt', quantity: 0, reason: '', user: 'Current User'
    });
    setShowModal(null);
  };

  // Add category
  const addCategory = () => {
    const newId = `cat_${Date.now()}`;
    const subcats = newCategory.subcategories.split(',').map(s => s.trim()).filter(s => s);
    setCategories([...categories, { 
      id: newId, 
      name: newCategory.name, 
      subcategories: subcats 
    }]);
    setNewCategory({ name: '', subcategories: '' });
    setShowModal(null);
  };

  // Add supplier
  const addSupplier = () => {
    const newId = `sup_${Date.now()}`;
    setSuppliers([...suppliers, { 
      id: newId, 
      ...newSupplier 
    }]);
    setNewSupplier({ name: '', contact: '', phone: '' });
    setShowModal(null);
  };

  // Generate reorder suggestions
  const getReorderSuggestions = () => {
    return inventory.filter(item => {
      const status = getStockStatus(item);
      return status.status === 'critical' || status.status === 'low';
    }).map(item => ({
      ...item,
      suggestedOrder: Math.ceil((item.maxStock - item.currentStock) * 1.1),
      urgency: getStockStatus(item).status === 'critical' ? 'High' : 'Medium'
    }));
  };

  // Export data
  const exportData = () => {
    const data = { 
      inventory, 
      categories, 
      suppliers, 
      stockAdjustments, 
      dependencies,
      exportDate: new Date().toISOString(),
      summary: {
        totalItems: inventory.length,
        totalValue: totalValue,
        criticalItems: criticalItems.length,
        lowStockItems: lowStockItems.length
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warehouse_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Get item adjustments history
  const getItemAdjustments = (itemId) => {
    return stockAdjustments.filter(adj => adj.itemId === itemId).slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Advanced Warehouse Management</h1>
                <p className="text-gray-600">Complete inventory control & dependency tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right mr-4">
                <div className="text-sm text-gray-600">Total Value</div>
                <div className="text-lg font-bold text-green-600">${totalValue.toLocaleString()}</div>
              </div>
              <button
                onClick={() => setShowModal('addItem')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Alerts */}
          {criticalItems.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-800">Critical Stock Alert</span>
                  <span className="text-red-700">
                    {criticalItems.length} items need immediate attention
                  </span>
                </div>
                <button 
                  onClick={() => setShowModal('reorder')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  View Suggestions
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'inventory', name: 'Inventory', icon: Package2 },
                { id: 'adjustments', name: 'Stock Adjustments', icon: Calendar },
                { id: 'categories', name: 'Categories', icon: Settings },
                { id: 'suppliers', name: 'Suppliers', icon: Users },
                { id: 'analytics', name: 'Analytics', icon: BarChart3 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
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
        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filters & Search */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold mb-4">Filters & Search</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items, locations, barcodes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showLowStock}
                      onChange={(e) => setShowLowStock(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show only low stock items</span>
                  </label>
                </div>
              </div>

              {/* Inventory List */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Inventory Items</h2>
                  <span className="text-sm text-gray-500">{filteredInventory.length} items</span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredInventory.map(item => {
                    const stockStatus = getStockStatus(item);
                    const IconComponent = stockStatus.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedItem?.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        } ${stockStatus.bg}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <IconComponent className={`w-4 h-4 ${stockStatus.color}`} />
                            </div>
                            <p className="text-sm text-gray-600">{item.size} - {item.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {item.category}
                              </span>
                              <span className="text-xs text-gray-500">#{item.barcode}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${stockStatus.color}`}>
                              {item.currentStock} {item.unit}
                            </div>
                            <div className="text-xs text-gray-500">
                              ${(item.currentStock * item.costPerUnit).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              Min: {item.minStock} | Max: {item.maxStock}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div className="lg:col-span-2">
              {selectedItem ? (
                <div className="space-y-6">
                  {/* Item Details Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingItem({...selectedItem});
                            setShowModal('editItem');
                          }}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setNewAdjustment({...newAdjustment, itemId: selectedItem.id});
                            setShowModal('addAdjustment');
                          }}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Adjust Stock</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Basic Info */}
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Basic Information</h3>
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
                            <span className="text-gray-600">Length:</span>
                            <span className="font-medium">{selectedItem.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Material:</span>
                            <span className="font-medium">{selectedItem.material}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Weight:</span>
                            <span className="font-medium">{selectedItem.weight} kg</span>
                          </div>
                        </div>
                      </div>

                      {/* Stock & Financial */}
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Stock & Financial</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Stock:</span>
                            <span className={`font-semibold ${getStockStatus(selectedItem).color}`}>
                              {selectedItem.currentStock} {selectedItem.unit}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Min Stock:</span>
                            <span className="font-medium">{selectedItem.minStock}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Max Stock:</span>
                            <span className="font-medium">{selectedItem.maxStock}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost per Unit:</span>
                            <span className="font-medium">${selectedItem.costPerUnit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Value:</span>
                            <span className="font-semibold text-green-600">
                              ${(selectedItem.currentStock * selectedItem.costPerUnit).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Stock Level Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>0</span>
                            <span>{selectedItem.maxStock}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${
                                selectedItem.currentStock <= selectedItem.minStock ? 'bg-red-500' :
                                selectedItem.currentStock <= selectedItem.minStock * 1.2 ? 'bg-orange-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((selectedItem.currentStock / selectedItem.maxStock) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Location & Tracking */}
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Location & Tracking</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-medium">{selectedItem.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Supplier:</span>
                            <span className="font-medium">{selectedItem.supplier}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Barcode:</span>
                            <span className="font-medium font-mono text-xs">{selectedItem.barcode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date Added:</span>
                            <span className="font-medium">{selectedItem.dateAdded}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="font-medium">{selectedItem.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Adjustments */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold mb-4">Recent Stock Adjustments</h3>
                    <div className="space-y-3">
                      {getItemAdjustments(selectedItem.id).length > 0 ? (
                        getItemAdjustments(selectedItem.id).map(adj => (
                          <div key={adj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                adj.type === 'receipt' ? 'bg-green-100 text-green-600' :
                                adj.type === 'issue' ? 'bg-red-100 text-red-600' :
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                {adj.type === 'receipt' ? '+' : adj.type === 'issue' ? '-' : '~'}
                              </div>
                              <div>
                                <div className="font-medium">{adj.reason}</div>
                                <div className="text-sm text-gray-500">{adj.date} by {adj.user}</div>
                              </div>
                            </div>
                            <div className={`font-semibold ${
                              adj.quantity > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {adj.quantity > 0 ? '+' : ''}{adj.quantity}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No recent adjustments</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <Package2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Item</h3>
                  <p className="text-gray-600">Choose an item from the inventory list to view detailed information</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stock Adjustments Tab */}
        {activeTab === 'adjustments' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Stock Adjustments</h2>
              <button
                onClick={() => setShowModal('addAdjustment')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>New Adjustment</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockAdjustments.map(adj => {
                    const item = inventory.find(i => i.id === adj.itemId);
                    return (
                      <tr key={adj.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{adj.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item ? item.name : 'Unknown Item'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            adj.type === 'receipt' ? 'bg-green-100 text-green-800' :
                            adj.type === 'issue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {adj.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          adj.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {adj.quantity > 0 ? '+' : ''}{adj.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{adj.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{adj.user}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Categories</h2>
                <button
                  onClick={() => setShowModal('addCategory')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map(sub => (
                        <span key={sub} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Category Usage</h2>
              <div className="space-y-3">
                {categories.map(category => {
                  const itemCount = inventory.filter(item => item.category === category.name).length;
                  return (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-600">{itemCount} items</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Suppliers</h2>
              <button
                onClick={() => setShowModal('addSupplier')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Supplier</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map(supplier => {
                const supplierItems = inventory.filter(item => item.supplier === supplier.name);
                return (
                  <div key={supplier.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{supplier.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>📧 {supplier.contact}</div>
                      <div>📞 {supplier.phone}</div>
                      <div className="mt-2 font-medium text-blue-600">
                        {supplierItems.length} items supplied
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                </div>
                <Package2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-orange-600">{lowStockItems.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
                </div>
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Reorder Suggestions</h3>
              <div className="space-y-3">
                {getReorderSuggestions().map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">Current: {item.currentStock} | Min: {item.minStock}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">Order: {item.suggestedOrder}</div>
                      <div className={`text-xs ${item.urgency === 'High' ? 'text-red-600' : 'text-orange-600'}`}>
                        {item.urgency} Priority
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal === 'addItem' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Item name (e.g., Z BEAM STANDARD)"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <select
                value={newItem.subcategory}
                onChange={(e) => setNewItem({...newItem, subcategory: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subcategory</option>
                {newItem.category && categories.find(c => c.name === newItem.category)?.subcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Size (e.g., 200x100x8mm)"
                value={newItem.size}
                onChange={(e) => setNewItem({...newItem, size: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Length (e.g., 6000mm)"
                value={newItem.length}
                onChange={(e) => setNewItem({...newItem, length: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location (e.g., Zone A-1-B3)"
                value={newItem.location}
                onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Material (e.g., S355 Steel)"
                value={newItem.material}
                onChange={(e) => setNewItem({...newItem, material: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Current Stock"
                value={newItem.currentStock}
                onChange={(e) => setNewItem({...newItem, currentStock: parseInt(e.target.value) || 0})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Min Stock"
                value={newItem.minStock}
                onChange={(e) => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max Stock"
                value={newItem.maxStock}
                onChange={(e) => setNewItem({...newItem, maxStock: parseInt(e.target.value) || 0})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Unit (e.g., pieces, kg)"
                value={newItem.unit}
                onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Cost per Unit"
                value={newItem.costPerUnit}
                onChange={(e) => setNewItem({...newItem, costPerUnit: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Weight (kg)"
                value={newItem.weight}
                onChange={(e) => setNewItem({...newItem, weight: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newItem.supplier}
                onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Supplier</option>
                {suppliers.map(sup => (
                  <option key={sup.id} value={sup.name}>{sup.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Barcode"
                value={newItem.barcode}
                onChange={(e) => setNewItem({...newItem, barcode: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addNewItem}
                disabled={!newItem.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Add Item
              </button>
              <button
                onClick={() => {
                  setShowModal(null);
                  resetNewItem();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showModal === 'editItem' && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={editingItem.category}
                onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={editingItem.size}
                onChange={(e) => setEditingItem({...editingItem, size: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={editingItem.location}
                onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={editingItem.minStock}
                onChange={(e) => setEditingItem({...editingItem, minStock: parseInt(e.target.value) || 0})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={editingItem.maxStock}
                onChange={(e) => setEditingItem({...editingItem, maxStock: parseInt(e.target.value) || 0})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.01"
                value={editingItem.costPerUnit}
                onChange={(e) => setEditingItem({...editingItem, costPerUnit: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={saveEditedItem}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowModal(null);
                  setEditingItem(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Adjustment Modal */}
      {showModal === 'addAdjustment' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Stock Adjustment</h3>
            <div className="space-y-4">
              <select
                value={newAdjustment.itemId}
                onChange={(e) => setNewAdjustment({...newAdjustment, itemId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Item</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              <select
                value={newAdjustment.type}
                onChange={(e) => setNewAdjustment({...newAdjustment, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="receipt">Receipt (+)</option>
                <option value="issue">Issue (-)</option>
                <option value="adjustment">Adjustment (~)</option>
              </select>
              <input
                type="number"
                placeholder="Quantity (use negative for decreases)"
                value={newAdjustment.quantity}
                onChange={(e) => setNewAdjustment({...newAdjustment, quantity: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={newAdjustment.date}
                onChange={(e) => setNewAdjustment({...newAdjustment, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Reason for adjustment"
                value={newAdjustment.reason}
                onChange={(e) => setNewAdjustment({...newAdjustment, reason: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              ></textarea>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addStockAdjustment}
                disabled={!newAdjustment.itemId || !newAdjustment.reason}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Add Adjustment
              </button>
              <button
                onClick={() => setShowModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showModal === 'addCategory' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Category</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Subcategories (comma separated)"
                value={newCategory.subcategories}
                onChange={(e) => setNewCategory({...newCategory, subcategories: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              ></textarea>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addCategory}
                disabled={!newCategory.name}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Add Category
              </button>
              <button
                onClick={() => setShowModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showModal === 'addSupplier' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Supplier</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Supplier name"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Contact email"
                value={newSupplier.contact}
                onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addSupplier}
                disabled={!newSupplier.name}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Add Supplier
              </button>
              <button
                onClick={() => setShowModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseManagementSystem;