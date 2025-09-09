import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User, Heart, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shirts", href: "/shirts" },
    { name: "Pants", href: "/pants" },
    { name: "T-Shirts", href: "/tshirts" },
    { name: "Accessories", href: "/accessories" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.includes(href)) return true;
    return false;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    
    // Try to get full name from user metadata first
    const fullName = user.user_metadata?.full_name;
    if (fullName && fullName.trim()) {
      return fullName;
    }
    
    // Fallback to email username
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 border-b border-border/50">
          <div className="text-sm text-muted-foreground">
            Free shipping on orders above ₹1999
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <Link to="/admin" className="hover:text-brand-gold transition-colors">
              Admin
            </Link>
            <span className="text-muted-foreground">|</span>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{getUserDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b">
                    {user.email}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600 hover:text-red-700">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hover:text-brand-gold transition-colors">
                  Sign In
                </Link>
                <span className="text-muted-foreground">|</span>
                <Link to="/signup" className="hover:text-brand-gold transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            <span className="bg-hero-gradient bg-clip-text text-transparent">
              Rayalaseema
            </span>
            <span className="text-brand-gold ml-1">Fashions</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors hover:text-brand-gold ${
                  isActive(item.href)
                    ? "text-brand-gold"
                    : "text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-navy text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors hover:text-brand-gold ${
                    isActive(item.href)
                      ? "text-brand-gold"
                      : "text-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-border/50 space-y-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-sm hover:text-brand-gold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-sm hover:text-brand-gold transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-2 text-sm hover:text-brand-gold transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 text-sm hover:text-brand-gold transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-sm hover:text-red-600 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 text-sm hover:text-brand-gold transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center gap-2 text-sm hover:text-brand-gold transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;