import { useState, useEffect } from 'react';
import { StorageService } from '@/services/storage';
import { Category, Product, CartItem } from '@/types/menu';
import { Icons } from '@/components/menu/Icons';
import { Logo } from '@/components/menu/Logo';
import { toast } from '@/hooks/use-toast';

export const PublicMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');

  useEffect(() => {
    setCategories(StorageService.getCategories());
    setProducts(StorageService.getProducts());

    const savedCart = localStorage.getItem('kingburguer_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('kingburguer_cart', JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: "Adicionado ao carrinho!",
      description: `${product.name} foi adicionado.`,
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const updateObservation = (id: string, obs: string) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, observation: obs } : item
    ));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleFinishOrder = () => {
    if (!customerName.trim()) {
      toast({ title: "Atenção", description: "Por favor, informe seu nome.", variant: "destructive" });
      return;
    }
    if (!address.trim()) {
      toast({ title: "Atenção", description: "Por favor, informe seu endereço ou número da mesa.", variant: "destructive" });
      return;
    }

    const phoneNumber = "5531991222846";

    let message = `*🔥 PEDIDO PREMIUM BURGUER*\n`;
    message += `--------------------------------\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📍 *Local:* ${address}\n`;
    message += `💳 *Pagamento:* ${paymentMethod === 'pix' ? 'PIX' : paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'}\n`;
    message += `--------------------------------\n\n`;

    cart.forEach(item => {
      message += `${item.quantity}x ${item.name}\n`;
      if (item.observation) {
        message += `   📝 _${item.observation}_\n`;
      }
      message += `   R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
    });

    message += `--------------------------------\n`;
    message += `*💰 TOTAL: R$ ${cartTotal.toFixed(2).replace('.', ',')}*\n`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-20 font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${scrolled ? 'glass-dark shadow-xl py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className={`transition-all duration-300 ${scrolled ? 'scale-75 origin-left' : 'scale-100'}`}>
            <Logo />
          </div>

          <div className={`relative transition-all duration-300 ${scrolled ? 'w-48 md:w-64' : 'w-0 opacity-0 overflow-hidden md:w-64 md:opacity-100'}`}>
            {scrolled && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-9 pr-4 py-2 rounded-full text-sm text-black bg-white/90 border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Icons.Search className="w-4 h-4 text-gray-600 absolute left-3 top-2.5" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-foreground">
          <img
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Burger"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-foreground/80"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col items-center md:items-start pt-24">
          <div className="container mx-auto">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full mb-3 tracking-wider animate-fade-in-up">
              ABERTO TODOS OS DIAS
            </span>
            <h1 className="text-4xl md:text-6xl font-display text-white mb-2 drop-shadow-lg animate-fade-in-up [animation-delay:100ms]">
              O VERDADEIRO <br/><span className="text-primary">SABOR DO REI</span>
            </h1>
            <p className="text-white/90 text-sm md:text-lg max-w-md animate-fade-in-up [animation-delay:200ms] font-medium bg-black/30 px-4 py-2 rounded-xl backdrop-blur-sm">
              Ingredientes selecionados, carne suculenta e molhos artesanais que você só encontra aqui.
            </p>

            <div className={`relative w-full max-w-lg mt-6 animate-fade-in-up [animation-delay:300ms] ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <input
                type="text"
                placeholder="O que você deseja comer hoje?"
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-black bg-white/95 border border-white/30 focus:bg-white focus:ring-2 focus:ring-primary shadow-2xl placeholder-gray-600 transition-all text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Icons.Search className="w-6 h-6 text-gray-600 absolute left-4 top-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="sticky top-[60px] md:top-[70px] z-20 bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-2">
        <div className="container mx-auto overflow-x-auto no-scrollbar px-4 flex space-x-2 py-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-foreground text-primary shadow-lg scale-105 ring-2 ring-primary/50'
                : 'bg-card text-muted-foreground hover:bg-secondary border border-border'
            }`}
          >
            🔥 Destaques
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-foreground text-primary shadow-lg scale-105 ring-2 ring-primary/50'
                  : 'bg-card text-muted-foreground hover:bg-secondary border border-border'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-1 bg-primary rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-display text-foreground">
            {activeCategory === 'all'
              ? 'Nosso Cardápio'
              : categories.find(c => c.id === activeCategory)?.name}
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border">
            <div className="text-6xl mb-4 grayscale opacity-50">🍔</div>
            <p className="text-xl font-bold text-foreground">Ops! Nada por aqui.</p>
            <p className="text-muted-foreground">Tente buscar por outro termo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-card rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden border border-border relative animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {!product.isAvailable ? (
                    <div className="absolute inset-0 bg-foreground/70 z-20 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-destructive text-destructive-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border border-destructive">
                        Esgotado
                      </span>
                    </div>
                  ) : (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-foreground/50 backdrop-blur-md text-card px-3 py-1 rounded-lg text-xs font-bold border border-card/10 shadow-sm">
                        {categories.find(c => c.id === product.categoryId)?.name}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 right-4 z-20 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-display text-xl shadow-lg transform group-hover:-translate-y-1 transition-transform border-2 border-card">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-card-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed font-light">
                    {product.description}
                  </p>

                  {product.isAvailable ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full mt-auto bg-foreground hover:bg-primary hover:text-primary-foreground text-card font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md active:scale-95"
                    >
                      <span className="text-sm tracking-wide">ADICIONAR AO PEDIDO</span>
                      <Icons.Plus className="w-5 h-5 transition-transform group-hover/btn:rotate-90" />
                    </button>
                  ) : (
                    <button disabled className="w-full mt-auto bg-secondary text-muted-foreground font-semibold py-3.5 px-4 rounded-xl cursor-not-allowed border border-border text-sm">
                      Indisponível
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-bounce-slow">
          <button
            onClick={() => setIsCartOpen(true)}
            className="group relative bg-foreground hover:bg-foreground/80 text-primary p-4 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all hover:scale-110 flex items-center justify-center border-2 border-primary"
          >
            <Icons.ShoppingBag className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-foreground">
              {cartCount}
            </span>
            <span className="absolute right-full mr-3 bg-card text-foreground px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Ver Carrinho R$ {cartTotal.toFixed(2).replace('.', ',')}
            </span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>

          <div className="relative w-full max-w-md bg-card h-full shadow-2xl flex flex-col animate-slide-in-right transform">
            <div className="bg-foreground text-card p-6 flex items-center justify-between shadow-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-foreground to-foreground/90"></div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Icons.ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Seu Pedido</h2>
                  <p className="text-xs text-muted-foreground">{cartCount} itens adicionados</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="relative z-10 p-2 hover:bg-card/10 rounded-full transition-colors"
              >
                <Icons.X className="w-6 h-6 text-card" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/50">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <div className="bg-secondary p-6 rounded-full mb-4">
                    <Icons.ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                  <p className="font-medium text-lg text-foreground">Sua sacola está vazia</p>
                  <p className="text-sm mb-6">Adicione itens deliciosos do nosso cardápio!</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-foreground text-card px-6 py-2 rounded-full text-sm font-bold hover:bg-foreground/80 transition-colors"
                  >
                    Ver Cardápio
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col gap-3 group hover:border-primary/30 transition-colors">
                    <div className="flex gap-4">
                      <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover bg-secondary" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-foreground text-sm leading-tight pr-2">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground/50 hover:text-destructive transition-colors"
                          >
                            <Icons.Trash className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-primary font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                          <div className="flex items-center gap-2 bg-secondary rounded-lg p-1 border border-border">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-card rounded-md shadow-sm hover:bg-secondary text-muted-foreground">
                              <Icons.Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-foreground text-card rounded-md shadow-sm hover:bg-foreground/80">
                              <Icons.Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full border-t border-border pt-2">
                      <input
                        type="text"
                        placeholder="Alguma observação?"
                        className="text-xs w-full bg-transparent border-none p-0 focus:ring-0 text-muted-foreground placeholder-muted-foreground/50 outline-none"
                        value={item.observation || ''}
                        onChange={(e) => updateObservation(item.id, e.target.value)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                <div className="space-y-4 mb-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.User className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu Nome"
                      className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card outline-none text-sm transition-all"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.MapPin className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Endereço de Entrega"
                      className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card outline-none text-sm transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'pix', label: 'PIX', icon: '💠' },
                      { id: 'card', label: 'Cartão', icon: '💳' },
                      { id: 'cash', label: 'Dinheiro', icon: '💵' },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === method.id
                            ? 'bg-foreground text-card border-foreground'
                            : 'bg-card text-muted-foreground border-border hover:border-muted-foreground'
                        }`}
                      >
                        <span className="text-base">{method.icon}</span>
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-end mb-4 border-t border-dashed border-border pt-4">
                  <span className="text-muted-foreground font-medium text-sm">Total a pagar</span>
                  <span className="text-3xl font-display text-foreground leading-none">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>

                <button
                  onClick={handleFinishOrder}
                  className="w-full bg-whatsapp hover:bg-whatsapp-hover text-card font-bold py-4 rounded-xl shadow-lg shadow-whatsapp/30 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                >
                  <Icons.WhatsApp className="w-6 h-6" />
                  <span className="tracking-wide">FINALIZAR PEDIDO NO ZAP</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="bg-foreground text-muted-foreground py-12 mt-12 text-center text-sm border-t-8 border-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
        <div className="relative z-10">
          <div className="opacity-80 mb-6 transform scale-75 origin-center grayscale hover:grayscale-0 transition-all duration-500">
            <Logo />
          </div>
          <p className="font-medium text-card">© 2025 Sanderson Cardoso.</p>
          <p className="text-xs mt-2 opacity-50">Feito com 💛 e muito código.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicMenu;
