
"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/store-context';
import { Badge } from "@/components/ui/badge";

export default function ClientCartBadge() {
  const { cart } = useStore();
  const [cartCount, setCartCount] = useState<number | null>(null);

  useEffect(() => {
    // This ensures the cart count is only read and set on the client side after hydration
    setCartCount(cart.length);
  }, [cart]); // Update when cart changes

  if (cartCount === null || cartCount === 0) {
    return null; // Don't render the badge if count is 0 or not yet determined
  }

  return (
    <Badge
      variant="destructive" // Use destructive variant for visibility
      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
      aria-label={`${cartCount} itens no carrinho`}
    >
      {cartCount}
    </Badge>
  );
}
