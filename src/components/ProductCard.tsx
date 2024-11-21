import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onRemoveFromCart?: (productId: number) => void;
    isInCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
    onRemoveFromCart,
    isInCart,
}) => {
    return (
        <Card className="shadow-lg w-full h-full">
            {product.image ? (
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-t"
                />
            ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                </div>
            )}
            <CardHeader className="py-2">
                <h3 className="text-sm font-semibold">{product.name}</h3>
            </CardHeader>
            <CardContent className="py-2">
                <p className="text-sm text-gray-600">
                    Precio: ${product.price}
                </p>
            </CardContent>
            <CardFooter className="py-2">
                {onRemoveFromCart ? (
                    <Button
                        onClick={() => onRemoveFromCart(product.id)}
                        variant="destructive"
                        className="text-xs"
                    >
                        Remover
                    </Button>
                ) : (
                    <Button
                        onClick={() => onAddToCart && onAddToCart(product)}
                        disabled={isInCart}
                        className="text-xs"
                    >
                        {isInCart ? "En el Carrito" : "Añadir al Carrito"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
