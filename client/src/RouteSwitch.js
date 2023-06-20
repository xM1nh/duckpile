import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import PurchasePage from './pages/PurchasePage'

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/products' element={<ProductListPage />} />
                <Route path='/product/:id' element={<ProductDetailPage />} />
                <Route path='/purchases' element={<PurchasePage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch