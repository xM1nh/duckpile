import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ProductListPage from "./pages/Product/ProductListPage";
import ProductDetailPage from "./pages/Product/ProductDetailPage";
import PurchasePage from './pages/Purchase/PurchasePage'
import SalesPage from './pages/Sale/SalesPage'
import InventoryPage from "./pages/Inventory/InventoryPage";
import CustomerPage from "./pages/Customer/CustomerPage";
import SupplierPage from "./pages/Supplier/SupplierPage";
import CreateProductForm from "./pages/Product/CreateProductPage";
import EditProductPage from "./pages/Product/EditProductPage";


const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/products' element={<ProductListPage />} />
                <Route path='/product/:id' element={<ProductDetailPage />} />
                <Route path='/product/create' element={<CreateProductForm />}/>
                <Route path='/product/:id/edit' element={<EditProductPage />} />
                <Route path='/purchases' element={<PurchasePage />} />
                <Route path='/sales' element={<SalesPage />} />
                <Route path='/inventory' element={<InventoryPage />} />
                <Route path='/customers' element={<CustomerPage />} />
                <Route path='/suppliers' element={<SupplierPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch