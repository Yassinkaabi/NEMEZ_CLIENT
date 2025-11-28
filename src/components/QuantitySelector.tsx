import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";

type QuantitySelectorProps = {
    onAddToCart: (quantity: number) => void;
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ onAddToCart }) => {
    const [quantity, setQuantity] = useState<number>(1);

    const increase = () => setQuantity(q => Math.min(99, q + 1));
    const decrease = () => setQuantity(q => Math.max(1, q - 1));

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
            >
                <button onClick={decrease}>-</button>
                <span style={{ padding: "10px 20px" }}>{quantity}</span>
                <button onClick={increase}>+</button>
            </div>

            <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={() => onAddToCart(quantity)}
                style={{ background: '#000', border: 'none', borderRadius: 8, height: 56, padding: '0 40px' }}
            >
                Add to cart
            </Button>
        </div>
    );
};

export default QuantitySelector;
