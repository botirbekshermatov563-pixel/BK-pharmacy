import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { db } from '../../services/db';
import { ShoppingBag, Clock, CheckCircle2, XCircle, User, Phone, MapPin, RefreshCw } from 'lucide-react';

export const OrdersTab = () => {
  const { lang, t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const data = await db.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await db.updateOrderStatus(orderId, newStatus);
    loadOrders();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800 font-display">
          {lang === 'uz' ? "Kelib tushgan buyurtmalar" : "Поступившие заказы клиентов"}
        </h3>
        <button
          onClick={loadOrders}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{lang === 'uz' ? "Yangilash" : "Обновить"}</span>
        </button>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              {/* Top Order Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    #{order.order_number || order.id?.slice(0, 8)}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                    {order.status === 'new' && t('status_new')}
                    {order.status === 'processing' && t('status_processing')}
                    {order.status === 'completed' && t('status_completed')}
                    {order.status === 'cancelled' && t('status_cancelled')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {order.created_at ? new Date(order.created_at).toLocaleString() : ''}
                  </span>
                  
                  {/* Status Dropdown */}
                  <select
                    value={order.status || 'new'}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 outline-none cursor-pointer"
                  >
                    <option value="new">{t('status_new')}</option>
                    <option value="processing">{t('status_processing')}</option>
                    <option value="completed">{t('status_completed')}</option>
                    <option value="cancelled">{t('status_cancelled')}</option>
                  </select>
                </div>
              </div>

              {/* Customer and Delivery Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Клиент:</span>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.customer_name}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Телефон:</span>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${order.customer_phone}`} className="text-emerald-700 hover:underline">
                      {order.customer_phone}
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Адрес доставки:</span>
                  <div className="font-medium text-slate-700 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{order.delivery_city}, {order.delivery_address}</span>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="p-2.5 rounded-xl bg-slate-50 text-xs text-slate-600 italic">
                  Комментарий: {order.notes}
                </div>
              )}

              {/* Items List */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Состав заказа:</div>
                {Array.isArray(order.items) && order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-700">
                    <span>
                      {idx + 1}. {it.name_ru || it.name_uz} ({it.dosage}) x {it.quantity} шт.
                    </span>
                    <span className="font-semibold">
                      {Number(it.sum || (it.price * it.quantity)).toLocaleString()} {t('currency')}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-xs sm:text-sm text-slate-900 font-display">
                  <span>ИТОГО:</span>
                  <span>{Number(order.total_amount).toLocaleString()} {t('currency')}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-700">
            {lang === 'uz' ? "Hozircha buyurtmalar yo'q" : "Пока нет новых заказов"}
          </h4>
          <p className="text-xs text-slate-400">
            {lang === 'uz' ? "Mijozlar buyurtma berganda bu yerda aks etadi" : "Оформленные клиентами заказы будут отображаться в этой таблице"}
          </p>
        </div>
      )}

    </div>
  );
};
