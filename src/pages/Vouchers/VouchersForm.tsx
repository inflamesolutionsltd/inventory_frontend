import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Upload, X } from 'lucide-react';

const schema = yup.object({
  voucherNumber: yup.string().required('Voucher number is required'),
  type: yup.string().oneOf(['payment', 'receipt', 'journal'], 'Invalid voucher type').required('Voucher type is required'),
  date: yup.date().required('Date is required'),
  partyId: yup.string().when('type', {
    is: (type: string) => type !== 'journal',
    then: (schema) => schema.required('Party is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  description: yup.string().required('Description is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  paymentMethod: yup.string().required('Payment method is required'),
  reference: yup.string(),
  accountId: yup.string().required('Account is required'),
  status: yup.string().oneOf(['pending', 'approved', 'rejected'], 'Invalid status').required('Status is required'),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const mockParties = [
  { id: '1', name: 'ABC Electronics Ltd.', type: 'supplier' },
  { id: '2', name: 'John Smith', type: 'customer' },
  { id: '3', name: 'TechCorp Solutions', type: 'supplier' },
];

const mockAccounts = [
  { id: '1', name: 'Cash Account', code: '1001' },
  { id: '2', name: 'Bank Account - Main', code: '1002' },
  { id: '3', name: 'Accounts Receivable', code: '1201' },
  { id: '4', name: 'Accounts Payable', code: '2001' },
];

export const VouchersForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [selectedAttachments, setSelectedAttachments] = React.useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: isEdit ? {
      voucherNumber: 'VCH-2024-001',
      type: 'payment',
      date: new Date('2024-01-15'),
      partyId: '1',
      description: 'Payment for Invoice INV-2024-001',
      amount: 2500.00,
      paymentMethod: 'Bank Transfer',
      reference: 'TXN123456789',
      accountId: '2',
      status: 'approved',
      notes: 'Payment processed successfully',
    } : {
      voucherNumber: `VCH-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      date: new Date(),
      status: 'pending',
    },
  });

  const voucherType = watch('type');

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Voucher data:', data);
      console.log('Attachments:', selectedAttachments);
      navigate('/vouchers');
    } catch (error) {
      console.error('Error saving voucher:', error);
    }
  };

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setSelectedAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getPaymentMethods = () => {
    switch (voucherType) {
      case 'payment':
        return ['Bank Transfer', 'Check', 'Cash', 'Credit Card', 'Digital Wallet'];
      case 'receipt':
        return ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Check', 'Digital Wallet'];
      case 'journal':
        return ['Journal Entry', 'Adjustment', 'Transfer'];
      default:
        return [];
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
          onClick={() => navigate('/vouchers')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Voucher' : 'New Voucher'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update voucher information' : 'Create a new voucher entry'}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voucher Number *
              </label>
              <input
                {...register('voucherNumber')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter voucher number"
              />
              {errors.voucherNumber && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.voucherNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voucher Type *
              </label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="payment">Payment Voucher</option>
                <option value="receipt">Receipt Voucher</option>
                <option value="journal">Journal Voucher</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date *
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
                Status *
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Transaction Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {voucherType !== 'journal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Party *
                </label>
                <select
                  {...register('partyId')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select party</option>
                  {mockParties.map(party => (
                    <option key={party.id} value={party.id}>
                      {party.name} ({party.type})
                    </option>
                  ))}
                </select>
                {errors.partyId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.partyId.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account *
              </label>
              <select
                {...register('accountId')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select account</option>
                {mockAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.code})
                  </option>
                ))}
              </select>
              {errors.accountId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.accountId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </label>
              <input
                {...register('amount')}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method *
              </label>
              <select
                {...register('paymentMethod')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select payment method</option>
                {getPaymentMethods().map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.paymentMethod.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reference Number
              </label>
              <input
                {...register('reference')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter reference number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter transaction description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Attachments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attachments</h2>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Upload receipts, invoices, or supporting documents
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleAttachmentUpload}
              className="hidden"
              id="attachment-upload"
            />
            <label
              htmlFor="attachment-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
            >
              Select Files
            </label>
          </div>

          {selectedAttachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedAttachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-900 dark:text-white truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Notes</h2>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter any additional notes or comments..."
          />
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
            onClick={() => navigate('/vouchers')}
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
            {isEdit ? 'Update Voucher' : 'Create Voucher'}
          </button>
        </motion.div>
      </form>
    </div>
  );
};