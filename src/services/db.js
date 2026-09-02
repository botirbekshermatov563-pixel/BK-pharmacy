import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'bk_pharmacy_products',
  CATEGORIES: 'bk_pharmacy_categories',
  SETTINGS: 'bk_pharmacy_settings',
  ORDERS: 'bk_pharmacy_orders'
};

// Initialize localStorage if empty
const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
};

initLocalStorage();

export const db = {
  // PRODUCTS
  async getProducts() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase products fetch failed, using local DB:', e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return local ? JSON.parse(local) : INITIAL_PRODUCTS;
  },

  async saveProduct(product) {
    if (isSupabaseConfigured && supabase) {
      try {
        if (product.id && !product.id.startsWith('prod-temp-')) {
          const { data, error } = await supabase.from('products').upsert(product).select().single();
          if (!error && data) return data;
        } else {
          const { id, ...newProd } = product;
          const { data, error } = await supabase.from('products').insert(newProd).select().single();
          if (!error && data) return data;
        }
      } catch (e) {
        console.warn('Supabase product save failed, fallback to local:', e);
      }
    }

    // Local fallback
    const products = await this.getProducts();
    let saved;
    if (product.id) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        products[idx] = { ...products[idx], ...product, updated_at: new Date().toISOString() };
        saved = products[idx];
      } else {
        saved = { ...product, id: product.id || `prod-temp-${Date.now()}` };
        products.unshift(saved);
      }
    } else {
      saved = { ...product, id: `prod-temp-${Date.now()}`, created_at: new Date().toISOString() };
      products.unshift(saved);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return saved;
  },

  async deleteProduct(productId) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', productId);
      } catch (e) {
        console.warn('Supabase delete product failed, deleting locally:', e);
      }
    }
    const products = (await this.getProducts()).filter(p => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  },

  // CATEGORIES
  async getCategories() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase categories fetch failed:', e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return local ? JSON.parse(local) : INITIAL_CATEGORIES;
  },

  async saveCategory(category) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').upsert(category).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase category save failed:', e);
      }
    }
    const categories = await this.getCategories();
    const idx = categories.findIndex(c => c.slug === category.slug || c.id === category.id);
    let saved;
    if (idx >= 0) {
      categories[idx] = { ...categories[idx], ...category };
      saved = categories[idx];
    } else {
      saved = { ...category, id: category.id || `cat-${Date.now()}` };
      categories.push(saved);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return saved;
  },

  async deleteCategory(categoryId) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', categoryId);
      } catch (e) {
        console.warn('Supabase delete category failed:', e);
      }
    }
    const categories = (await this.getCategories()).filter(c => c.id !== categoryId && c.slug !== categoryId);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return true;
  },

  // ORDERS
  async getOrders() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase orders fetch failed:', e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return local ? JSON.parse(local) : [];
  },

  async createOrder(orderData) {
    const orderNumber = `BK-${Date.now().toString().slice(-6)}`;
    const fullOrder = {
      ...orderData,
      order_number: orderNumber,
      status: 'new',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').insert(fullOrder).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase order insert failed, saving locally:', e);
      }
    }

    const orders = await this.getOrders();
    const localOrder = { ...fullOrder, id: `order-${Date.now()}` };
    orders.unshift(localOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return localOrder;
  },

  async updateOrderStatus(orderId, status) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase order update failed:', e);
      }
    }

    const orders = await this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      orders[idx].status = status;
      orders[idx].updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return orders[idx];
    }
    return null;
  },

  // SETTINGS (CMS)
  async getSettings() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (!error && data && data.length > 0) {
          const settingsObj = {};
          data.forEach(item => {
            settingsObj[item.key] = item.value;
          });
          return settingsObj;
        }
      } catch (e) {
        console.warn('Supabase settings fetch failed:', e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return local ? JSON.parse(local) : INITIAL_SETTINGS;
  },

  async updateSettings(newSettings) {
    if (isSupabaseConfigured && supabase) {
      try {
        for (const [key, value] of Object.entries(newSettings)) {
          await supabase.from('site_settings').upsert({ key, value });
        }
      } catch (e) {
        console.warn('Supabase settings update failed:', e);
      }
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    return newSettings;
  },

  // IMAGE UPLOAD (Supabase Storage with fallback to Base64)
  async uploadImage(file) {
    if (isSupabaseConfigured && supabase) {
      try {
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
        const { data, error } = await supabase.storage.from('product-images').upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
        if (!error && data) {
          const { data: publicData } = supabase.storage.from('product-images').getPublicUrl(fileName);
          return publicData.publicUrl;
        }
      } catch (e) {
        console.warn('Supabase storage upload error, falling back to base64 preview:', e);
      }
    }

    // Fallback: convert to base64 data URL for local display
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
