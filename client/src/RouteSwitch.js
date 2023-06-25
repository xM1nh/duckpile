import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import PurchasePage from './pages/PurchasePage'
import SalesPage from './pages/SalesPage'
import InventoryPage from "./pages/InventoryPage";
import CustomerPage from "./pages/CustomerPage";
import SupplierPage from "./pages/SupplierPage";
import CreateBookForm from "./components/forms/Create/CreateBookForm";


const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/products' element={<ProductListPage />} />
                <Route path='/product/:id' element={<ProductDetailPage />} />
                <Route path='/product/add' element={<CreateBookForm />}/>
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