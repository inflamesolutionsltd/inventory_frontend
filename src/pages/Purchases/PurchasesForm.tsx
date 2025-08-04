import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const itemSchema = yup.object({
  productId: yup.string().required('Product is required'),
  description: yup.string().required('Description is required'),
  quantity: yup.number().positive('Quantity must be positive').required('Quantity is required'),
  unitPrice: yup.number().positive('Unit price must be positive').required('Unit price is required'),
  discount: yup.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%').default(0),
});

const schema = yup.object({
  supplierId: yup.string().required('Supplier is required'),
  purchaseNumber: yup.string().required('Purchase number is required'),
  date: yup.date().required('Date is required'),
  expectedDate: yup.date().required('Expected delivery date is required'),
  items: yup.array().of(itemSchema).min(1, 'At least one item is required'),
  subtotal: yup.number().min(0, 'Subtotal cannot be negative'),
  taxRate: yup.number().min(0, 'Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100%').default(10),
  taxAmount: yup.number().min(0, 'Tax amount cannot be negative'),
  discountType: yup.string().oneOf(['percentage', 'fixed'], 'Invalid discount type').default('percentage'),
  discountValue: yup.number().min(0, 'Discount cannot be negative').default(0),
  discountAmount: yup.number().min(0, 'Discount amount cannot be negative'),
  total: yup.number().min(0, 'Total cannot be negative'),
  status: yup.string().oneOf(['pending', 'shipped', 'received', 'cancelled'], 'Invalid status').required('Status is required'),
  paymentStatus: yup.string().oneOf(['pending', 'paid', 'overdue'], 'Invalid payment status').required('Payment status is required'),
  paymentTerms: yup.string(),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const mockProducts = [
  { id: '1', name: 'iPhone 15 Pro', price: 750.00 },
  { id: '2', name: 'Samsung Galaxy S24', price: 650.00 },
  { id: '3', name: 'MacBook Air M3', price: 999.99 },
];

const mockSuppliers = [
  { id: '1', name: 'ABC Electronics Ltd.' },
  { id: '2', name: 'TechCorp Solutions' },
  { id: '3', name: 'Global Supplies Inc.' },
];

export const PurchasesForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: isEdit ? {
      supplierId: '1',
      purchaseNumber: 'PO-2024-001',
      date: new Date('2024-01-15'),
      expectedDate: new Date('2024-01-25'),
      items: [
        {
          productId: '1',
          description: 'iPhone 15 Pro - 128GB (Wholesale)',
          quantity: 10,
          unitPrice: 750.00,
          discount: 5,
        },
        {
          productId: '2',
          description: 'Samsung Galaxy S24 - 256GB (Wholesale)',
          quantity: 5,
          unitPrice: 650.00,
          discount: 0,
        },
      ],
      subtotal: 10750.00,
      taxRate: 10,
      taxAmount: 1037.50,
      discountType: 'fixed',
      discountValue: 500,
      discountAmount: 500.00,
      total: 11287.50,
      status: 'received',
      paymentStatus: 'paid',
      paymentTerms: 'Net 30',
      notes: 'Bulk order for Q1 inventory',
    } : {
      purchaseNumber: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      date: new Date(),
      expectedDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      items: [{ productId: '', description: '', quantity: 1, unitPrice: 0, discount: 0 }],
      taxRate: 10,
      discountType: 'percentage',
      discountValue: 0,
      status: 'pending',
      paymentStatus: 'pending',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedTaxRate = watch('taxRate');
  const watchedDiscountType = watch('discountType');
  const watchedDiscountValue = watch('discountValue');

  // Calculate totals
  React.useEffect(() => {
    const subtotal = watchedItems.reduce((sum, item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      const itemDiscount = itemTotal * ((item.discount || 0) / 100);
      return sum + itemTotal - itemDiscount;
    }, 0);

    const discountAmount = watchedDiscountType === 'percentage' 
      ? subtotal * ((watchedDiscountValue || 0) / 100)
      : (watchedDiscountValue || 0);

    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * ((watchedTaxRate || 0) / 100);
    const total = taxableAmount + taxAmount;

    setValue('subtotal', subtotal);
    setValue('discountAmount', discountAmount);
    setValue('taxAmount', taxAmount);
    setValue('total', total);
  }, [watchedItems, watchedTaxRate, watchedDiscountType, watchedDiscountValue, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Purchase data:', data);
      navigate('/purchases');
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
  };

  const addItem = () => {
    append({ productId: '', description: '', quantity: 1, unitPrice: 0, discount: 0 });
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      setValue(`items.${index}.productId`, productId);
      setValue(`items.${index}.description`, `${product.name} (Wholesale)`);
      setValue(`items.${index}.unitPrice`, product.price);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-4"
      >
        <button
          onClick={() => navigate('/purchases')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Purchase' : 'New Purchase'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update purchase order information' : 'Create a new purchase order'}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Purchase Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Purchase Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supplier *
              </label>
              <select
                {...register('supplierId')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select supplier</option>
                {mockSuppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
              {errors.supplierId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.supplierId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Purchase Number *
              </label>
              <input
                {...register('purchaseNumber')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter purchase number"
              />
              {errors.purchaseNumber && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.purchaseNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Date *
              </label>
              <input
                {...register('date')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected Delivery *
              </label>
              <input
                {...register('expectedDate')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.expectedDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expectedDate.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product *
                  </label>
                  <select
                    {...register(`items.${index}.productId`)}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select product</option>
                    {mockProducts.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <input
                    {...register(`items.${index}.description`)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Item description"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity *
                  </label>
                  <input
                    {...register(`items.${index}.quantity`)}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit Price *
                  </label>
                  <input
                    {...register(`items.${index}.unitPrice`)}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discount %
                  </label>
                  <input
                    {...register(`items.${index}.discount`)}
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="w-full p-2 text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Calculations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calculations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount Type
                </label>
                <select
                  {...register('discountType')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount Value
                </label>
                <input
                  {...register('discountValue')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  {...register('taxRate')}
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${watch('subtotal')?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  -${watch('discountAmount')?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tax:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${watch('taxAmount')?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${watch('total')?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status & Payment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status & Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Status *
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Status *
              </label>
              <select
                {...register('paymentStatus')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select payment status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
              {errors.paymentStatus && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.paymentStatus.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Terms
              </label>
              <select
                {...register('paymentTerms')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select payment terms</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter any additional notes..."
              />
            </div>
          </div>
        </motion.div>

        {/* Form Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => navigate('/purchases')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            {isEdit ? 'Update Purchase' : 'Create Purchase'}
          </button>
        </motion.div>
      </form>
    </div>
  );
};