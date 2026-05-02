import React, { useState, useEffect } from "react";
import { 
  Star, 
  Sparkles, 
  Moon, 
  Sun, 
  Heart, 
  Search, 
  Menu, 
  X, 
  ArrowRight, 
  Mail, 
  Github, 
  Twitter,
  ExternalLink,
  MessageCircle,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Components ---

const FloatingStar = ({ delay = 0, x = "50%", y = "50%", size = 20 }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [1, 1.2, 1], 
      opacity: [1, 0.5, 1],
      rotate: [0, 90, 180, 270, 360]
    }}
    transition={{ 
      duration: 3, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut"
    }}
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
  >
    <Star size={size} className="star-shape bg-y2k-blue/50 border-2 border-black" />
  </motion.div>
);

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
}

const StickerCard = ({ post }: { post: Post; key?: React.Key }) => {
  const rotation = Math.random() * 4 - 2;
  return (
    <motion.div
      whileHover={{ scale: 1.02, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative group h-full"
      style={{ rotate: `${rotation}deg` }}
    >
      <div className="h-full sticker-card p-6 overflow-hidden flex flex-col group-hover:bg-white/95 transition-colors">
        <div className="relative aspect-[4/3] overflow-hidden mb-3">
          <img
            src={`https://picsum.photos/seed/${post.id}/800/600`}
            alt={post.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 right-2 flex gap-1">
             <div className="bg-pink-400 text-white text-[10px] px-3 py-1 uppercase font-black border-2 border-black rounded-full rotate-3 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
               NEW!
             </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-y2k-pink bg-y2k-pink/10 px-2 py-0.5 rounded-full">
              {post.category}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {post.date}
            </span>
          </div>
          <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-y2k-pink transition-colors text-gray-900">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-auto pt-4 border-t border-dashed border-gray-200 flex items-center justify-between font-sans">
            <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider hover:text-y2k-pink transition-colors">
              Read More <ArrowRight size={14} />
            </button>
            <div className="flex gap-3 text-gray-400">
               <Heart size={16} className="hover:text-red-500 cursor-pointer transition-colors" />
               <MessageCircle size={16} className="hover:text-y2k-blue cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }} 
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-3 -left-3 rotate-[-15deg] pointer-events-none"
      >
        <Sparkles size={24} className="text-y2k-green fill-y2k-green/20 sticker-border bg-white rounded-full p-1" />
      </motion.div>
    </motion.div>
  );
};

interface BevelButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  key?: React.Key;
}

const BevelButton = ({ children, active = false, onClick, className = "" }: BevelButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-bold uppercase tracking-tighter transition-all active:scale-95 ${
      active ? "bevel-in bg-[#b5b5b5] translate-y-[1px]" : "bevel-out"
    } ${className}`}
  >
    {children}
  </button>
);

// --- Data ---

const POSTS = [
  {
    id: "1",
    title: "The Ultimate Guide to Holo-Tech Aesthetics",
    excerpt: "Dive into the iridescent world of holographic design and why it's dominating the 2026 digital landscape.",
    category: "Design",
    date: "2026.05.02",
  },
  {
    id: "2",
    title: "Why Cyber-Punk and Y2K are One and the Same",
    excerpt: "Exploring the intersections of 90s optimistic futurism and the gritty reality of tomorrow.",
    category: "Culture",
    date: "2026.04.28",
  },
  {
    id: "3",
    title: "Retro-Future Coding: Building with Nostalgia",
    excerpt: "How to implement classic web patterns in modern React architectures without sacrificing performance.",
    category: "Tech",
    date: "2026.04.15",
  },
  {
    id: "4",
    title: "Pixel Perfect: The Return of Dot Matrix UI",
    excerpt: "Screens are sharper than ever, so why are we craving the low-res look of 1999?",
    category: "Trends",
    date: "2026.04.05",
  },
  {
    id: "5",
    title: "Synthwave Beats for the Modern Office",
    excerpt: "Our curated playlist for maximum productivity and retro vibes in your digital workspace.",
    category: "Lifestyle",
    date: "2026.03.22",
  },
  {
    id: "6",
    title: "Virtual Reality in the Age of Discovery",
    excerpt: "Predicting the next decade of immersive storytelling through the lens of early internet wonder.",
    category: "Discovery",
    date: "2026.03.10",
  },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen holo-bg selection:bg-y2k-pink selection:text-white overflow-x-hidden">
      {/* Checkered Overlay */}
      <div className="absolute top-0 left-0 w-full h-24 checkered opacity-5 pointer-events-none" />
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass-holo p-2 sticker-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 w-12 h-12 flex items-center justify-center border-2 border-black rotate-[-10deg] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                 <span className="text-white font-black text-xl italic uppercase tracking-tighter">Y2K</span>
              </div>
              <h1 className="text-xl font-black uppercase tracking-tightest hidden sm:block text-blue-600 italic">
                채사피엔스 <span className="text-black">블로그</span>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              {["Home", "Blog", "Visuals", "History", "Connect"].map((tab) => (
                <BevelButton 
                  key={tab} 
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </BevelButton>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2 bg-white/50 border border-white/30 px-3 py-1.5 rounded-sm">
                <Search size={16} className="text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search aesthetics..." 
                  className="bg-transparent text-xs font-bold uppercase outline-none w-32 placeholder:text-gray-400"
                />
              </div>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 bevel-out active:bevel-in"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/90 backdrop-blur-xl md:hidden pt-24 px-4"
          >
            <div className="flex flex-col gap-4">
              {["Home", "Blog", "Visuals", "History", "Connect"].map((tab) => (
                <button
                  key={tab}
                  className="text-4xl font-black uppercase tracking-tighter text-left hover:text-y2k-pink transition-colors"
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMenuOpen(false);
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative glass-holo border-4 border-black p-8 md:p-16 flex flex-col items-center text-center overflow-hidden shadow-[12px_12px_0px_rgba(0,0,0,0.2)]">
            {/* Background Decorations */}
            <FloatingStar x="5%" y="10%" size={40} delay={0.5} />
            <FloatingStar x="90%" y="20%" size={30} delay={1.2} />
            <FloatingStar x="15%" y="80%" size={25} delay={0.8} />
            <FloatingStar x="85%" y="70%" size={35} delay={2} />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="relative z-10"
            >
              <div className="bg-yellow-200 inline-block px-4 py-1 mb-6 border-2 border-black rounded-full rotate-2 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                 <span className="text-black font-black uppercase tracking-widest text-[10px]">2026.05.02 — CYBER_UPDATE</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tightest leading-[0.85] mb-8 text-gray-900">
                AI로 만드는 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-y2k-blue via-y2k-pink to-y2k-green">미래</span>
              </h2>
              <p className="text-lg md:text-xl font-bold max-w-2xl mx-auto mb-10 text-gray-700 leading-tight">
                Welcome to the digital time-capsule. We're rediscovering the magic of late 90s tech optimism, iridescent interfaces, and sticker-heavy culture.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-4 bg-y2k-pink text-white font-black uppercase tracking-widest sticker-border hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                  EXPLORE FEED <ArrowRight size={20} />
                </button>
                <button className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest sticker-border hover:scale-105 active:scale-95 transition-all">
                  HISTORY ARCHIVE
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-24">
        {/* Categories Bar */}
        <div className="mb-12 flex flex-wrap gap-2 items-center">
           <span className="text-xs font-bold uppercase mr-4 px-2 py-1 bg-black text-white">Filter By:</span>
           {["All", "Design", "Culture", "Tech", "Trends", "Lifestyle"].map(cat => (
             <BevelButton key={cat} active={cat === "All"} className="px-3 py-1">
               {cat}
             </BevelButton>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-12 lg:col-span-8">
            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {POSTS.map((post) => (
                <StickerCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          <aside className="md:col-span-12 lg:col-span-4 space-y-8">
            {/* Admin Profile */}
            <div className="bevel-out p-5 flex flex-col gap-4">
              <div className="bevel-in bg-black aspect-square flex items-center justify-center overflow-hidden relative group">
                <img 
                  src="https://picsum.photos/seed/admin/400/400" 
                  alt="Admin" 
                  className="w-full h-full object-cover opacity-50 contrast-125 grayscale"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lime-400 font-mono text-center text-[10px] animate-pulse tracking-widest bg-black/80 px-2 py-1">
                    [ ACCESSING_SERVER... ]
                  </span>
                </div>
              </div>
              <div className="text-center font-black py-2 bg-blue-600 text-white border-2 border-black uppercase italic tracking-tighter shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                ADMIN: USER_N_LEE
              </div>
              <div className="text-[10px] font-black leading-tight uppercase border-t-2 border-black/10 pt-4">
                Mood: ٩(◕‿◕)۶ <br />
                Today's Jam: Cyber Tokyo '99
              </div>
              <div className="flex justify-between items-center bg-white border-2 border-black p-2">
                <span className="text-[10px] font-black uppercase">Status:</span>
                <span className="text-[10px] font-black uppercase text-green-600 animate-pulse">Online</span>
              </div>
            </div>

            {/* Counter Section */}
            <div className="sticker-card p-6 bg-yellow-300 transform rotate-2 relative shadow-[10px_10px_0px_rgba(0,0,0,1)]">
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center rotate-12">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
              </div>
              <h4 className="font-black mb-4 uppercase border-b-4 border-black text-xs italic tracking-widest pb-1">
                Visual Visits
              </h4>
              <div className="text-4xl font-black tracking-[0.2em] text-center py-4 font-mono bg-black text-yellow-300 border-4 border-black">
                004,129
              </div>
              <div className="mt-4 text-[8px] font-black uppercase text-center opacity-50">
                LOCKED AT 56K MODEM SPEED
              </div>
            </div>

            {/* Small Banner */}
            <div className="bevel-out bg-black p-4 text-white rotate-[-1deg]">
               <h5 className="font-black text-xs uppercase mb-2 text-cyan-400 underline">System Logs:</h5>
               <ul className="text-[9px] font-mono space-y-1 opacity-80">
                 <li>{">"} Kernel boot successful...</li>
                 <li>{">"} Holographic drivers loaded...</li>
                 <li>{">"} Aesthetics maximized...</li>
               </ul>
            </div>
          </aside>
        </div>

        {/* Load More */}
        <div className="mt-16 flex justify-center">
           <button className="relative group">
              <div className="absolute inset-0 bg-y2k-blue translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              <div className="relative bg-white border-4 border-black px-12 py-4 font-black uppercase tracking-widest text-lg">
                LOAD MORE VIBES
              </div>
           </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-y2k-silver border-t-8 border-white p-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 w-12 h-12 flex items-center justify-center border-2 border-black rotate-[5deg] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                   <span className="text-white font-black text-2xl">Y2K</span>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic text-blue-600">
                  CYBER <br /><span className="text-black">ARCHIVES</span>
                </h2>
              </div>
              <p className="font-bold text-gray-700 max-w-md mb-8">
                Documenting the evolution of digital aesthetics from the 1.44MB floppy era to the post-modern holographic web.
              </p>
              <div className="flex gap-4">
                <div className="p-3 bg-white sticker-border hover:bg-y2k-blue transition-colors cursor-pointer">
                  <Github size={20} />
                </div>
                <div className="p-3 bg-white sticker-border hover:bg-y2k-pink transition-colors cursor-pointer">
                  <Twitter size={20} />
                </div>
                <div className="p-3 bg-white sticker-border hover:bg-y2k-green transition-colors cursor-pointer">
                   <Mail size={20} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-black uppercase tracking-widest text-sm mb-6 border-b-2 border-black inline-block">Links</h3>
              <ul className="flex flex-col gap-3 font-bold uppercase text-xs">
                <li className="hover:text-y2k-pink cursor-pointer flex items-center gap-2"><ArrowRight size={14}/> Design Assets</li>
                <li className="hover:text-y2k-pink cursor-pointer flex items-center gap-2"><ArrowRight size={14}/> Cyber Sociology</li>
                <li className="hover:text-y2k-pink cursor-pointer flex items-center gap-2"><ArrowRight size={14}/> Synthwave Radio</li>
                <li className="hover:text-y2k-pink cursor-pointer flex items-center gap-2"><ArrowRight size={14}/> Merchandise</li>
              </ul>
            </div>

            <div>
              <h3 className="font-black uppercase tracking-widest text-sm mb-6 border-b-2 border-black inline-block">Newsletter</h3>
              <p className="text-[10px] font-bold uppercase mb-4 text-gray-600">Get weekly aesthetic injections.</p>
              <div className="flex flex-col gap-2">
                <div className="bevel-in bg-white p-2 flex items-center">
                  <input 
                    type="email" 
                    placeholder="E-MAIL HERE" 
                    className="w-full bg-transparent outline-none text-xs font-bold"
                  />
                </div>
                <BevelButton className="bg-y2k-green text-black">SUBSCRIBE</BevelButton>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              © 2026 Y2K REVIVAL STUDIO — DESIGNED FOR THE DIAL-UP GENERATION
            </p>
            <div className="flex gap-6 items-center">
              <span className="text-[10px] font-bold uppercase text-y2k-pink animate-pulse">SYSTEM: ONLINE</span>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-y2k-green" />
                 <span className="text-[10px] font-bold uppercase">LOCKED AT 1024x768</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Sparkle Decoration */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-none hidden lg:block">
         <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           className="relative"
         >
           <Sparkles size={80} className="text-y2k-blue opacity-10 blur-sm" />
           <div className="absolute inset-0 flex items-center justify-center">
             <Star size={40} className="text-y2k-pink opacity-20" />
           </div>
         </motion.div>
      </div>
    </div>
  );
}

