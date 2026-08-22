import React, { useState } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Utensils, ArrowLeft, Clock, Plus, Minus, Check, MessageCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { enquiryService } from '@/services/enquiry.service';

// Helper for formatting currency
const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

const MENU_INTERESTS = [
  'Smallie Parfait',
  'Exotic Parfaits',
  'Greek Yoghurt',
  'Smoothies',
  'Cold-Pressed Juices',
  'Sandwiches',
  'Healthy Chicken Salad',
  'Fruit Bowls',
  'Zobo',
  'Tigernut Drink',
  'Whole Wheat Banana Bread',
  'Treat Boxes',
  'Other'
];

interface EventProduct {
  name: string;
  description: string;
}

const POPULAR_EVENT_PRODUCTS: EventProduct[] = [
  {
    name: 'Smallie Parfait',
    description: 'Perfect 330ml cup size for high-tea, office brunches, and birthday celebrations.'
  },
  {
    name: 'Sandwiches',
    description: 'Freshly assembled club sandwiches sliced neatly for easy sharing and platters.'
  },
  {
    name: 'Smoothies',
    description: 'Creamy, chilled 50cl fruit blends served fresh in premium spill-proof bottles.'
  },
  {
    name: 'Cold-Pressed Juices',
    description: '100% natural, raw cold-pressed fruit combinations to keep your guests energized.'
  },
  {
    name: 'Zobo',
    description: 'Traditional hibiscus drink infused with cloves and ginger — a local event favorite.'
  },
  {
    name: 'Tigernut Drink',
    description: 'Rich and creamy dairy-free tiger nut blend infused with dates and ginger.'
  },
  {
    name: 'Fruit Bowls',
    description: 'Brimming bowls of freshly carved seasonal fruit salads, presented beautifully.'
  }
];

export default function CateringEventsPage() {
  const { addItem } = useCart();
  
  // Smallie Parfait States
  const [parfaitQty, setParfaitQty] = useState(2); // Minimum 2 cups
  
  // Event Form States
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [eventDetails, setEventDetails] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  // Form submission feedback
  const [validationError, setValidationError] = useState('');

  const handleAddParfait = () => {
    addItem({
      productId: 'smallie-parfait',
      name: 'Smallie Parfait',
      image: '/assets/Screenshot_20260729-212242_1785360049881.jpg',
      price: 4000,
      quantity: parfaitQty,
      options: [{ name: 'Category', value: 'Catering & Events' }]
    });
    setParfaitQty(2); // Reset to minimum
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleCateringEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validations
    if (!eventType) {
      setValidationError('Please select an event type.');
      return;
    }
    if (!guestCount) {
      setValidationError('Please specify the number of guests.');
      return;
    }
    if (!eventDate) {
      setValidationError('Please select an event date.');
      return;
    }
    if (!customerName.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!customerPhone.trim()) {
      setValidationError('Please enter your Phone / WhatsApp number.');
      return;
    }

    // Format enquiry message for WhatsApp
    const interestsText = selectedInterests.length > 0 
      ? selectedInterests.map(i => `• ${i}`).join('\n') 
      : '• General Enquiry / SITI FRUITIES Selection';

    const message = `🎪 *CATERING & EVENT ENQUIRY — SITI FRUITIES*
    
👤 *Name:* ${customerName}
📞 *Phone:* ${customerPhone}
${customerEmail ? `✉️ *Email:* ${customerEmail}\n` : ''}
📅 *Event Date:* ${eventDate}
👥 *Expected Guests:* ${guestCount} people
🎈 *Event Type:* ${eventType}

🛍️ *PRODUCTS OF INTEREST:*
${interestsText}

📝 *EVENT DETAILS / REQUESTS:*
${eventDetails.trim() || 'None'}

    // Save enquiry to database for admin review
    enquiryService.submitCateringEnquiry({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail.trim() || null,
      event_type: eventType,
      guest_count: guestCount,
      event_date: eventDate,
      menu_interests: selectedInterests,
      event_details: eventDetails.trim() || null,
    }).catch(console.error);

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2348120842962?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        {/* Banner Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-sky-850 to-indigo-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif mb-4 leading-tight">
              Catering & Events
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Planning a meeting, gathering or special event? Let us help you put together something delicious for your guests.
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  Siti Catering
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground leading-tight mb-6">
                  Make Your Next Gathering a Little More Exotic
                </h2>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed mb-6">
                  From office meetings to special gatherings, SITI FRUITIES offers a selection of fruits, parfaits, drinks, sandwiches and other treats that can be arranged to suit your occasion.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Whether it is a morning boardroom check-in, a milestone party, or a formal catering dessert table, our team prepares everything clean, fresh, and beautifully packaged to serve on-time.
                </p>
              </div>

              {/* Colorful Gradient Branded Placeholder */}
              <div className="w-full">
                <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden aspect-[16/10] w-full max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-white/5" />
                  <div className="bg-white/20 backdrop-blur-md p-6 rounded-full shadow-inner mb-4 animate-pulse">
                    <Utensils className="w-14 h-14 stroke-[1.5]" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-2">SITI FRUITIES</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-sky-100">Fresh Event Platters & Cups</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smallie Parfait Feature Section */}
        <section className="py-16 bg-muted/40 border-t border-b border-border/40">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Featured Event Cup</span>
              <h2 className="text-3xl font-bold font-serif text-foreground">Smallie Parfait Offer</h2>
            </div>

            <div className="bg-card border border-card-border rounded-3xl p-6 md:p-10 shadow-md flex flex-col md:flex-row gap-8 items-center">
              {/* Product Thumbnail Placeholder */}
              <div className="w-full md:w-2/5 aspect-[4/3] bg-gradient-to-br from-sky-50 to-indigo-100 border border-indigo-250/20 rounded-2xl flex flex-col items-center justify-center p-6 shrink-0 relative overflow-hidden">
                <div className="bg-white/80 p-4 rounded-full shadow-sm">
                  <Utensils className="w-10 h-10 text-primary stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-primary/70 uppercase mt-4">Siti Events Parfaits</span>
              </div>

              {/* Description and Ordering Block */}
              <div className="flex-1 space-y-5">
                <div>
                  <h3 className="text-2xl font-bold font-serif text-foreground">Smallie Parfait</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    A perfect 330ml mini parfait cup layered with probiotic Greek yogurt, crunchy granola, fresh fruit toppings, and honey. Designed for corporate events, meetings, or celebrations.
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-4 pt-1">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Price</span>
                    <span className="text-2xl font-black text-primary">{formatPrice(4000)} / cup</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Minimum Order</span>
                    <span className="text-sm font-bold text-foreground">2 cups</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Bulk Pricing</span>
                    <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-md block mt-1">
                      Discounts may be available for larger orders.
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <div className="flex flex-col w-full sm:w-auto">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total price</span>
                    <span className="text-xl font-black text-primary leading-none mt-1">
                      {formatPrice(4000 * parfaitQty)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {/* Quantity controls (minimum 2) */}
                    <div className="flex items-center bg-muted rounded-full p-1 border border-border shrink-0">
                      <button 
                        type="button"
                        onClick={() => setParfaitQty(Math.max(2, parfaitQty - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:shadow-none"
                        disabled={parfaitQty <= 2}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-foreground">{parfaitQty}</span>
                      <button 
                        type="button"
                        onClick={() => setParfaitQty(parfaitQty + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Button 
                      onClick={handleAddParfait}
                      className="bg-secondary hover:bg-secondary/90 hover:shadow-md text-white font-bold rounded-full h-10 px-5 text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Order</span>
                    </Button>
                  </div>
                </div>

                {/* Bulk Order Callout */}
                {parfaitQty >= 5 && (
                  <div className="bg-sky-50 border border-sky-200/50 p-3.5 rounded-xl text-sky-800 text-xs font-semibold leading-relaxed">
                    Large-order pricing may be available. Ask us about discounts.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Guided Form and Suggested Products Sections */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Form Section */}
              <div className="lg:col-span-7 bg-card border border-card-border shadow-sm rounded-3xl p-6 md:p-10">
                <div>
                  <h2 className="text-3xl font-bold font-serif text-foreground">Planning an Event?</h2>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Tell us a little about your event and what you're looking for. We'll use the information to help you put together the right SITI FRUITIES order.
                  </p>
                </div>

                <form onSubmit={handleCateringEnquiry} className="space-y-6 mt-8">
                  {/* Event Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground block">Event Type *</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-white border border-border hover:border-primary/50 text-foreground text-sm font-semibold rounded-xl p-3 outline-none transition-all cursor-pointer h-12"
                    >
                      <option value="" disabled>Select event type...</option>
                      <option value="Office / Work Meeting">Office / Work Meeting</option>
                      <option value="Birthday / Celebration">Birthday / Celebration</option>
                      <option value="Party / Gathering">Party / Gathering</option>
                      <option value="Wedding / Engagement">Wedding / Engagement</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Grid fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Guest Count */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground block">Guest Count *</label>
                      <input
                        type="number"
                        min="1"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        placeholder="e.g. 20"
                        className="w-full bg-white border border-border hover:border-primary/50 text-foreground text-sm font-semibold rounded-xl p-3 outline-none transition-all h-12"
                      />
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground block">Event Date *</label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-white border border-border hover:border-primary/50 text-foreground text-sm font-semibold rounded-xl p-3 outline-none transition-all h-12"
                      />
                    </div>
                  </div>

                  {/* Menu Interests Checklist */}
                  <div className="space-y-3 pt-2">
                    <label className="text-sm font-bold text-foreground block">What would you like for your event?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MENU_INTERESTS.map((interest) => {
                        const isChecked = selectedInterests.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleInterestToggle(interest)}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                              isChecked
                                ? 'bg-primary/5 border-primary text-primary'
                                : 'bg-white border-border text-foreground hover:bg-muted/50'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                              isChecked 
                                ? 'bg-primary border-primary text-white' 
                                : 'border-border bg-white'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>{interest}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional details */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground block">Tell us anything else about your event</label>
                    <textarea
                      value={eventDetails}
                      onChange={(e) => setEventDetails(e.target.value)}
                      placeholder="Tell us about what you need, preferred products, quantities, special requests or anything else that would help us understand your order."
                      className="w-full bg-white border border-border hover:border-primary/50 text-foreground text-sm font-semibold rounded-xl p-3 outline-none transition-all h-28 resize-none"
                    />
                  </div>

                  {/* Contact details */}
                  <div className="border-t border-border/60 pt-6 space-y-6">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Your Contact Details</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground block">Name *</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full bg-white border border-border hover:border-primary/50 text-foreground text-sm font-semibold rounded-xl p-3 outline-none transition-all h-12"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground block">Phone / WhatsApp *</label>
                        <input
                          type="text"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. 08120842962"
                          className="w-full bg-white border border-border hover:border-primary/50 text-foreground text-sm font-semibold rounded-xl p-3 outline-none transition-all h-12"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground block">Email (Optional)</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. johndoe@gmail.com"
                        className="w-full bg-white border border-border hover:border-primary/50 text-foreground text-sm font-semibold rounded-xl p-3 outline-none transition-all h-12"
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  {validationError && (
                    <div className="bg-red-50 border border-red-200/50 text-red-700 text-xs font-bold p-3.5 rounded-xl">
                      {validationError}
                    </div>
                  )}

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold h-14 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>ENQUIRE VIA WHATSAPP</span>
                    </Button>
                  </div>

                </form>
              </div>

              {/* Suggestions Showcase Section */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-foreground">Popular for Events</h2>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Check items below to automatically add them to your enquiry menu interest.
                  </p>
                </div>

                <div className="space-y-4">
                  {POPULAR_EVENT_PRODUCTS.map((prod) => {
                    // Match sync category
                    const categoryMapping: Record<string, string> = {
                      'Smallie Parfait': 'Smallie Parfait',
                      'Sandwiches': 'Sandwiches',
                      'Smoothies': 'Smoothies',
                      'Cold-Pressed Juices': 'Cold-Pressed Juices',
                      'Zobo': 'Zobo',
                      'Tigernut Drink': 'Tigernut Drink',
                      'Fruit Bowls': 'Fruit Bowls'
                    };
                    const mappedInterest = categoryMapping[prod.name] || prod.name;
                    const isSelected = selectedInterests.includes(mappedInterest);
                    
                    return (
                      <div 
                        key={prod.name}
                        onClick={() => handleInterestToggle(mappedInterest)}
                        className={`bg-card rounded-2xl p-5 border shadow-sm flex items-start gap-4 transition-all cursor-pointer hover:shadow-md hover:border-primary/30 group ${
                          isSelected ? 'border-primary bg-primary/2 flex' : 'border-card-border'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 shrink-0 transition-all ${
                          isSelected 
                            ? 'bg-primary border-primary text-white' 
                            : 'border-border bg-white group-hover:border-primary/50'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                            {prod.name}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            {prod.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
      <CartPanel />
      <WhatsAppButton />
    </div>
  );
}
