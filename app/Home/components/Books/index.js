'use client';
import React, {useState} from "react";
import ProductCart from '../ProductCart/ProductCart'

const Index = () => {
    const [products, setProducts] = useState([
        {
        _id: "1",
        title: "Product 1",
        auther: "Author 1",
        src: 'https://rokbucket.rokomari.io/ProductNew20190903/130X186/Priyo_Olkanonda_Phool-Farhana_Nijhum-1d75b-446557.jpg'
        },
        {
        _id: "1",
        title: "Product 1",
        auther: "Author 1",

        },
        {
        _id: "1",
        title: "Product 1",
        auther: "Author 1",

        },
        {
        _id: "1",
        title: "Product 1",
        auther: "Author 1",

        },
    ]);


    return <section className="my-5 product-collection">
        <div className="product-section-title">
            <span className="custom-icon" /> <h3>Products</h3>
        </div>
        <div className="inner-product-collection light-shadow">
            { products?.length > 0 &&
                products.map((product, index) => {
                    return <ProductCart product={product} key={index} />;
                })}
        </div>
    </section>
}


export default Index;