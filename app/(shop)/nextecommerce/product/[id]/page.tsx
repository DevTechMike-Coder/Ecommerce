"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Heart, ShoppingBag, ArrowLeft, Check, ShieldCheck, Truck, RefreshCw, MessageSquare } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import ProductCard from "@/components/uiComponents/ProductCard";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  collectionTag: string;
  categoryId?: string;
  category: {
    id: string;
    name: string;
    slug?: string;
  };
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = typeof (params as Promise<{ id: string }>).then === "function" ? use(params as Promise<{ id: string }>) : (params as { id: string });
  const id = resolvedParams?.id;
  const router = useRouter();
  const cart = useCart();
  const wishlist = useWishlist();
  const { data: session } = authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Review submission state
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    async function fetchProductData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || `Failed to fetch product (${res.status})`);
        }
        const data: Product = await res.json();
        setProduct(data);
        setSelectedImage(data.images?.[0] || "");

        // Fetch related products in same category
        const allRes = await fetch("/api/products");
        if (allRes.ok) {
          const allData: Product[] = await allRes.json();
          const related = allData.filter(
            (p) =>
              (p.category?.name === data.category?.name || p.categoryId === data.category?.id) &&
              p.id !== data.id
          );
          setRelatedProducts(related.slice(0, 4));
        }
      } catch (err: unknown) {
        console.error("Failed to load product", err);
        const msg = err instanceof Error ? err.message : "Failed to load product details";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link
          href="/nextecommerce/collection"
          className="flex items-center gap-2 text-primary font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.isInWishlist(product.id);

  const handleToggleWishlist = async () => {
    if (!session) {
      toast.error("Please sign in to add to wishlist");
      router.push(`/nextecommerce/signIn?callbackURL=/nextecommerce/product/${product.id}`);
      return;
    }

    if (isWishlisted) {
      await wishlist.removeItem(product.id, true);
      toast.success("Removed from wishlist");
    } else {
      await wishlist.addItem(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          category: product.category.name,
          tag: product.collectionTag,
        },
        true
      );
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("Item is currently out of stock");
      return;
    }
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category.name,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/nextecommerce/cart");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to submit a review");
      router.push(`/nextecommerce/signIn?callbackURL=/nextecommerce/product/${product.id}`);
      return;
    }

    if (!userComment.trim()) {
      toast.error("Please write a comment for your review");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: userRating,
          comment: userComment,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const newReview: Review = await res.json();
      toast.success("Review submitted successfully!");
      setUserComment("");

      // Update product reviews locally
      setProduct((prev) => {
        if (!prev) return prev;
        const updatedReviews = [newReview, ...(prev.reviews || [])];
        const newCount = updatedReviews.length;
        const newAvg = Number(
          (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / newCount).toFixed(1)
        );
        return {
          ...prev,
          reviews: updatedReviews,
          reviewCount: newCount,
          averageRating: newAvg,
        };
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error submitting review";
      toast.error(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/nextecommerce" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/nextecommerce/collection" className="hover:text-foreground transition-colors">Products</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-muted border border-border shadow-lg">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                className="object-cover transition-all duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ShoppingBag size={64} strokeWidth={1} />
              </div>
            )}
            {product.collectionTag && product.collectionTag !== "REGULAR" && (
              <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-background/90 backdrop-blur-md text-xs font-black uppercase tracking-wider text-foreground border border-border">
                {product.collectionTag}
              </span>
            )}
          </div>

          {/* Thumbnail list if multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? "border-primary ring-2 ring-primary/20 scale-105"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-primary">
              {product.category?.name || "General"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(product.averageRating || 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-foreground">
              {product.averageRating ? product.averageRating.toFixed(1) : "New"}
            </span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount || 0} customer reviews)
            </span>
          </div>

          {/* Price & Stock */}
          <div className="flex items-center justify-between py-4 border-y border-border">
            <div>
              <p className="text-3xl font-black text-foreground">${product.price}</p>
              <p className="text-xs text-muted-foreground">Taxes & shipping calculated at checkout</p>
            </div>
            <div>
              {product.stock > 5 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
                </span>
              ) : product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Low Stock ({product.stock} left!)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Description</h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md"
            >
              Buy Now
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`h-14 w-14 rounded-2xl border border-border flex items-center justify-center transition-all ${
                isWishlisted ? "bg-red-500/10 text-red-500 border-red-500/30" : "hover:bg-muted text-muted-foreground"
              }`}
              title="Add to Wishlist"
            >
              <Heart className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border text-center">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/40">
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/40">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/40">
              <RefreshCw className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="space-y-8 pt-8 border-t border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Customer Reviews</h2>
            <p className="text-sm text-muted-foreground">See what verified buyers are saying about this product</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Write a Review Form */}
          <div className="lg:col-span-1 p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Leave a Review
            </h3>
            
            {!session ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-sm text-muted-foreground">Sign in to write a review for this product.</p>
                <Link
                  href={`/nextecommerce/signIn?callbackURL=/nextecommerce/product/${product.id}`}
                  className="inline-block px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= userRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    rows={4}
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Share details about product quality, fit, or performance..."
                    className="w-full rounded-2xl border border-border bg-muted/50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {!product.reviews || product.reviews.length === 0 ? (
              <div className="text-center py-12 rounded-3xl border border-dashed border-border p-6">
                <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="font-semibold text-muted-foreground">No reviews yet</p>
                <p className="text-xs text-muted-foreground mt-1">Be the first customer to share your thoughts!</p>
              </div>
            ) : (
              product.reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl border border-border bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {rev.user.name ? rev.user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{rev.user.name || "Anonymous User"}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-12">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-border">
          <h2 className="text-2xl font-extrabold tracking-tight">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                id={rel.id}
                name={rel.name}
                price={Number(rel.price)}
                image={rel.images[0]}
                category={product.category.name}
                tag={rel.collectionTag}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
