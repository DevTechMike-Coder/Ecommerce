"use client";
import { useState, useEffect } from "react";

export default function ProductTestPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [productData, setProductData] = useState({
    name: "", description: "", price: "", stock: "", categoryId: ""
  });

  useEffect(() => {
    fetch("/api/categories").then(res => res.json()).then(setCategories);
  }, []);

  const addCategory = async () => {
    const res = await fetch("/api/categories", {
      method: "POST", body: JSON.stringify({ name: categoryName })
    });
    if (res.ok) {
      setCategoryName("");
      fetch("/api/categories").then(res => res.json()).then(setCategories);
    }
  };

  const addProduct = async () => {
    const res = await fetch("/api/products", {
      method: "POST", body: JSON.stringify(productData)
    });
    if (res.ok) alert("Product added successfully! Check your shop page.");
  };

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-bold uppercase">Backend Test UI</h1>

      {/* Category Section */}
      <div className="border p-6 rounded-2xl space-y-4">
        <h2 className="text-xl font-bold">1. Add a Category (Required First)</h2>
        <div className="flex gap-2">
          <input className="border p-2 rounded-lg flex-1" value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="e.g. Electronics" />
          <button onClick={addCategory} className="bg-primary text-white px-4 py-2 rounded-lg">Add Category</button>
        </div>
      </div>

      {/* Product Section */}
      <div className="border p-6 rounded-2xl space-y-4">
        <h2 className="text-xl font-bold">2. Add a Product</h2>
        <input className="border p-2 rounded-lg w-full" placeholder="Product Name" onChange={e => setProductData({...productData, name: e.target.value})} />
        <textarea className="border p-2 rounded-lg w-full" placeholder="Description" onChange={e => setProductData({...productData, description: e.target.value})} />
        <div className="flex gap-2">
            <input className="border p-2 rounded-lg flex-1" type="number" placeholder="Price" onChange={e => setProductData({...productData, price: e.target.value})} />
            <input className="border p-2 rounded-lg flex-1" type="number" placeholder="Stock" onChange={e => setProductData({...productData, stock: e.target.value})} />
        </div>
        <select className="border p-2 rounded-lg w-full" aria-label="Select Category" onChange={e => setProductData({...productData, categoryId: e.target.value})}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={addProduct} className="bg-primary text-primary-foreground font-bold w-full py-4 rounded-xl">Add Product to Database</button>
      </div>
    </div>
  );
}
