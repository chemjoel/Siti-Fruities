import React from 'react';
import { useParams, Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductInfo {
  name: string;
  description: string;
  price: string;
  features?: string[];
}

interface CategoryDetail {
  title: string;
  description: string;
  gradient: string;
  products: ProductInfo[];
}

const CATEGORY_MAP: Record<string, CategoryDetail> = {
  'fruits': {
    title: 'Fresh Fruits & Healthy Snacks',
    description: 'Fresh, nutrient-dense fruit selections and healthy snacks prepared daily.',
    gradient: 'from-orange-500 to-amber-500',
    products: [
      { name: 'Exotic Fruit Salad Bowl', description: 'A freshly cut selection of seasonal local and exotic fruits.', price: '₦3,500' },
      { name: 'Healthy Chicken Salad', description: 'Fresh crisp vegetables, shredded chicken, and healthy light dressing.', price: '₦4,500' },
      { name: 'Fresh Fruit Bowl (Gbemidele Size)', description: 'Generous serving of nutrient-rich seasonal fruits.', price: '₦5,500' }
    ]
  },
  'greek-yogurt-parfaits': {
    title: 'Greek Yogurt & Parfaits',
    description: 'Rich, thick probiotic Greek Yogurt and premium layered parfaits with fresh fruits, granola, seeds, nuts, and natural honey.',
    gradient: 'from-emerald-500 to-rose-600',
    products: [
      { name: 'Greek Yogurt - Sweetened', description: 'Naturally sweetened, creamy probiotic yogurt.', price: 'From ₦4,500' },
      { name: 'Greek Yogurt - Unsweetened', description: 'Rich, tart, unsweetened Greek yogurt. Perfect for gut health.', price: 'From ₦4,500' },
      { name: 'VIP Parfait (500ml)', description: 'Greek yogurt layered with apple, banana, grapes, coconut, granola, and cashew nuts.', price: '₦8,000' },
      { name: 'VVIP Parfait (550ml)', description: 'Premium tier parfait with extra toppings including kiwi, strawberries, and rolled oats.', price: '₦9,000' },
      { name: 'Smallie Parfait (330ml)', description: 'Perfect size for events and quick healthy snacks (Minimum order: 2 cups).', price: '₦4,500' }
    ]
  },
  'smoothies': {
    title: 'Smoothies',
    description: 'Creamy, thick, and nutrient-dense smoothies made from fresh fruits and nuts.',
    gradient: 'from-purple-500 to-indigo-600',
    products: [
      { name: 'Nutty Choco Smoothie', description: 'Rich cocoa, banana, peanut butter, and plant milk blend.', price: '₦3,500' },
      { name: 'Avocado Green Smoothie', description: 'Creamy avocado, spinach, banana, and apple juice.', price: '₦4,000' },
      { name: 'Tropical Sunshine Smoothie', description: 'Mango, pineapple, banana, and coconut water.', price: '₦3,500' }
    ]
  },
  'cold-pressed-juices': {
    title: 'Cold-Pressed Juices',
    description: '100% natural, raw fruit juices cold-pressed to preserve maximum nutrients.',
    gradient: 'from-amber-400 to-orange-600',
    products: [
      { name: 'PING Juice (35cl)', description: 'Our signature blend of Pineapple and Ginger. Super refreshing.', price: '₦2,500' },
      { name: 'Pure Orange Juice', description: 'Freshly squeezed premium oranges with no added sugar.', price: '₦2,500' }
    ]
  },
  'sandwiches-savoury': {
    title: 'Sandwiches & Savoury',
    description: 'Freshly assembled sandwiches with fresh cabbage, carrot, premium protein, and in-house cream.',
    gradient: 'from-amber-600 to-yellow-600',
    products: [
      { name: 'Chicken & Egg Sandwich', description: 'Premium shredded chicken breast with fried or boiled egg and crisp vegetables.', price: '₦5,000' },
      { name: 'Chicken Sandwich', description: 'Tasty shredded chicken breast with crisp veggies and special sauce.', price: '₦3,000' },
      { name: 'Beef Sandwich', description: 'Juicy stir-fried beef slices with crisp veggies and special sauce.', price: '₦3,000' }
    ]
  },
  'milk-tea-drinks': {
    title: 'Milk Tea & Drinks',
    description: 'Milk Tea, traditional Zobo, fresh Tigernut drink, and other refreshing beverages.',
    gradient: 'from-pink-500 to-amber-600',
    products: [
      { name: 'Classic Milk Tea', description: 'Our signature original milk tea recipe with chewy black tapioca pearls.', price: '₦9,000' },
      { name: 'Vanilla Milk Tea', description: 'Smooth, fragrant vanilla-infused milk tea with chewy black tapioca pearls.', price: '₦8,000' },
      { name: 'Zobo Drink (50cl)', description: 'Traditional hibiscus flower tea infused with cloves and ginger.', price: '₦1,500' },
      { name: 'Fresh Tiger Nut Drink (50cl)', description: 'Raw tiger nut beverage infused with coconut, dates, and ginger.', price: '₦2,500' },
      { name: 'Tiger Nut & Coconut Blend (1L)', description: 'Thicker, ultra-creamy traditional tiger nut drink.', price: '₦4,500' },
      { name: 'Strawberry Cream Milkshake (500ml)', description: 'Made with fresh strawberries, healthy dairy, and honey.', price: '₦4,500' },
      { name: 'Vanilla Bean Milkshake (500ml)', description: 'Classic vanilla bean milkshake topped with crushed nuts.', price: '₦4,000' },
      { name: 'Double Chocolate Milkshake (500ml)', description: 'Rich dark cocoa milkshake sweetened with dates.', price: '₦4,500' }
    ]
  },
  'treat-boxes': {
    title: 'Treat Boxes',
    description: 'Curated combination boxes featuring healthy salads, yogurt, parfaits, and baked goodies.',
    gradient: 'from-purple-600 to-pink-500',
    products: [
      { 
        name: 'Deluxe Treatbox', 
        description: 'The ultimate healthy feast box.', 
        price: '₦35,000',
        features: ['1x Healthy Chicken Salad Bowl', '1x 500ml Greek Yoghurt', '1x Gbemidele Parfait (550ml)', '1x Exotic Fruit Salad Bowl', '1x 50cl Tigernut Drink', '1x 50cl Zobo Drink', '1x Pouch of Granola'] 
      },
      { 
        name: 'Intentional Treatbox', 
        description: 'Perfect balance of protein and sweetness.', 
        price: '₦29,500',
        features: ['1x Gbemidele Parfait', '1x Chicken and Egg Sandwich', '1x Exotic Fruit Bowl', '1x Wheat Banana Bread', '1x PING Juice', '1x Zobo Drink'] 
      },
      { 
        name: 'Mini Treatbox 2', 
        description: 'Quick healthy picnic box.', 
        price: '₦14,500',
        features: ['1x 500ml Exotic Parfait', '1x 35cl Zobo Drink', '1x Pack of Sandwich', '1x Pack of Toppings'] 
      },
      { 
        name: 'Mini Treatbox 3', 
        description: 'Great for breakfast or high tea.', 
        price: '₦17,500',
        features: ['1x 400ml Exotic Parfait', '2x Slices Whole Wheat Banana Bread', '1x 25cl Zobo Drink', '1x 25cl Cold-Pressed Juice'] 
      },
      { 
        name: 'Juicy Treatbox 2', 
        description: 'Curated for two to share.', 
        price: '₦23,500',
        features: ['1x PING Juice (Pineapple & Ginger)', '1x 500ml Exotic Parfait', '1x 50cl Zobo Drink', '2x Slices Whole Wheat Banana Bread', '1x Pack of Chicken/Beef Sandwich'] 
      },
      { 
        name: 'Perfecto Treatbox', 
        description: 'Complete gift set with a custom note card.', 
        price: '₦24,000',
        features: ['1x 500ml Exotic Parfait', '1x Pack of Chicken Sandwich', '2x Slices Whole Wheat Banana Bread', '1x Bottle of PING Juice', '1x Bottle of Cold Zobo', '1x Note Card'] 
      }
    ]
  },
  'fruit-hampers': {
    title: 'Fruit Hampers',
    description: 'Exquisite gift baskets packed with fresh fruits, premium nuts, and healthy delicacies.',
    gradient: 'from-emerald-700 to-green-600',
    products: [
      { 
        name: 'Deluxe Hamper', 
        description: 'The ultimate luxury fruit and wellness gift.', 
        price: '₦70,000',
        features: ['1x Whole Watermelon', '1x Whole Pineapple', '1L Greek Yoghurt', 'Mixed Nuts (500ml)', 'Granola (100g)', 'Red Apples & Oranges', 'Fresh Strawberries & Blueberries', 'Clementines, Kiwi, Biscuits & Cookies', 'Customized Basket & Note Card'] 
      },
      { 
        name: 'Exotic Fruit Hamper', 
        description: 'Vibrant, handpicked fresh fruit basket.', 
        price: '₦55,000',
        features: ['1x Big Pineapple', '1x Big Watermelon', '5x Red Apples', '4x Clementines', '1x Pack of Red Seedless Grapes', '1x Pack of Strawberries', '2x Kiwis, 2x Oranges, 2x Lemons', 'Luxury Hamper Basket & Note Card'] 
      }
    ]
  },
  'combos': {
    title: 'Combos',
    description: 'Specially paired healthy meal combinations at discounted rates.',
    gradient: 'from-amber-500 to-teal-600',
    products: [
      { name: 'Sandwich & Smoothie Combo', description: 'A freshly prepared Chicken or Beef Sandwich paired with any regular smoothie of your choice.', price: '₦6,000' },
      { name: 'Parfait & Salad Combo', description: 'A 500ml Exotic Parfait coupled with our signature Healthy Chicken Salad Bowl.', price: '₦12,500' },
      { name: 'Fruit Bowl & Greek Yogurt Combo', description: 'An Exotic Fruit Salad Bowl combined with a 500ml sweetened or unsweetened Greek Yogurt.', price: '₦7,500' }
    ]
  },
  'catering-events': {
    title: 'Catering & Events',
    description: 'Fresh healthy catering setups, bulk supply, and custom dessert tables for weddings, parties, and corporate events.',
    gradient: 'from-blue-600 to-emerald-600',
    products: [
      { name: 'Corporate Brunch Package', description: 'Assorted finger-sandwiches, fresh fruit cups, and mini yogurt parfaits (Serves 10-15).', price: '₦50,000' },
      { name: 'Celebration Dessert Table', description: 'Premium fruit salad carvings, assorted parfaits, and whole wheat banana bread loaves (Serves 25-30).', price: '₦120,000' },
      { name: 'Deluxe Event Catering Service', description: 'Fully staffed on-site custom smoothie bar and freshly made parfait cups for weddings or major events.', price: '₦250,000' }
    ]
  }
};

export default function CategoryPlaceholder() {
  const { category } = useParams<{ category: string }>();
  const data = category ? CATEGORY_MAP[category] : null;

  if (!data) {
    return (
      <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 pt-32 pb-16 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold font-serif mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">We couldn't find the category you're looking for.</p>
          <Link href="/">
            <Button className="rounded-full bg-primary text-white font-bold px-6">
              Back to Home
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        {/* Banner Section */}
        <section className={`relative py-16 md:py-24 bg-gradient-to-br ${data.gradient} text-white overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif mb-4 leading-tight">{data.title}</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">{data.description}</p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-4 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold font-serif text-foreground">Catalog Menu</h2>
                <p className="text-sm text-muted-foreground font-medium">Explore what is available in this category</p>
              </div>
              <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full border border-secondary/20">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Ordering Available Now</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {data.products.map((product, idx) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-card rounded-2xl shadow-md border border-card-border overflow-hidden p-6 md:p-8 flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className="text-xl font-bold font-serif text-foreground group-hover:text-primary transition-colors leading-tight">
                        {product.name}
                      </h3>
                      <span className="text-lg font-black text-primary shrink-0">{product.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      {product.description}
                    </p>

                    {product.features && product.features.length > 0 && (
                      <div className="bg-muted/50 rounded-xl p-4 mb-6">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Includes:</span>
                        <ul className="space-y-1.5">
                          {product.features.map((feat, fIdx) => (
                            <li key={fIdx} className="text-xs text-foreground/80 font-medium flex items-start gap-2">
                              <span className="text-secondary shrink-0">•</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 mt-auto flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Stage 2 Product
                    </span>
                    <a 
                      href={`https://wa.me/2348120842962?text=Hello%20Siti%20Fruities,%20I%20would%20like%20to%20order%20the%20${encodeURIComponent(product.name)}%20(${product.price})`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="rounded-full bg-secondary hover:bg-secondary/90 text-white font-bold h-9 text-xs px-4 shadow-sm hover:shadow-md transition-all">
                        Order on WhatsApp
                      </Button>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
