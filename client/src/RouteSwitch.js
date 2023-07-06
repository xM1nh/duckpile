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
import CustomerDetailPage from "./pages/Customer/CustomerDetailPage";
import CreateCustomerPage from "./pages/Customer/CreateCustomerPage";
import EditCustomerPage from "./pages/Customer/EditCustomerPage";


const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/products' element={<ProductListPage />} />
                <Route path='/product/:id' element={<ProductDetailPage />} />
                <Route path='/product/create' element={<CreateProductForm />}/>
                <Route path='/product/:id/edit' element={<EditProductPage />} />
                <Route path='/customers' element={<CustomerPage />} />
                <Route path='/customer/:id' element={<CustomerDetailPage />} />
                <Route path='/customer/create' element={<CreateCustomerPage />} />
                <Route path='/customer/:id/edit' element={<EditCustomerPage />} />
                <Route path='/purchases' element={<PurchasePage />} />
                <Route path='/sales' element={<SalesPage />} />
                <Route path='/inventory' element={<InventoryPage />} />
                <Route path='/suppliers' element={<SupplierPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch