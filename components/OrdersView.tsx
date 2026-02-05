
import React from 'react';
import { db } from '../database';
import { Order, OrderStatus } from '../types';
import { Language } from '../translations';

interface OrdersViewProps {
  customerName: string;
  language: Language;
  t: any;
}

const OrdersView: React.FC<OrdersViewProps> = ({ customerName, language, t }) => {
  const orders = db.getOrdersByCustomer(customerName).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatPrice = (price: number) => 
    new Intl.NumberFormat(language === 'ne' ? 'ne-NP' : 'en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(price).replace('NPR', 'Rs.');

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED: return 'text-green-600 bg-green-50 border-green-200';
      case OrderStatus.SHIPPED: return 'text-blue-600 bg-blue-50 border-blue-200';
      case OrderStatus.PENDING: return 'text-orange-600 bg-orange-50 border-orange-200';
      case OrderStatus.CANCELLED: return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight mb-8">{t.myOrders}</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-sm border shadow-sm">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">{t.noOrders}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-sm shadow-sm overflow-hidden transition-shadow hover:shadow-md">
              <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.orderDate}</p>
                    <p className="text-sm font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                    <p className="text-sm font-bold text-gray-700">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</p>
                    <p className="text-sm font-bold text-gray-700">{order.paymentMethod}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.products.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs">📦</div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">Product #{p.productId}</p>
                          <p className="text-xs text-gray-400">Qty: {p.quantity} x {formatPrice(p.price)}</p>
                        </div>
                      </div>
                      <p className="font-black text-gray-900">{formatPrice(p.price * p.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t flex justify-between items-end">
                  <div className="flex-1 max-w-xs">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tracking Timeline</p>
                    <div className="flex items-center gap-1">
                      {[OrderStatus.PENDING, OrderStatus.READY_TO_SHIP, OrderStatus.SHIPPED, OrderStatus.DELIVERED].map((s, idx) => {
                        const statusIndex = [OrderStatus.PENDING, OrderStatus.READY_TO_SHIP, OrderStatus.SHIPPED, OrderStatus.DELIVERED].indexOf(order.status);
                        const isCompleted = idx <= statusIndex;
                        return (
                          <React.Fragment key={s}>
                            <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-orange-500' : 'bg-gray-200'}`} />
                            {idx < 3 && <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-orange-500' : 'bg-gray-200'}`} />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Amount</p>
                    <p className="text-2xl font-black text-orange-600 leading-tight">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersView;
