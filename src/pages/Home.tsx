import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { obtenerImagenes } from "@/api/imageApi";
import { Product } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const productosDisponibles: Product[] = [
    { id: 1, name: "Laptop", price: 1000 },
    { id: 2, name: "Smartphone", price: 500 },
    { id: 3, name: "Auriculares", price: 150 },
    { id: 4, name: "Teclado", price: 75 },
    { id: 5, name: "Cámara", price: 800 },
    { id: 6, name: "Monitor", price: 300 },
    { id: 7, name: "Silla Gamer", price: 250 },
    { id: 8, name: "Lámpara de Escritorio", price: 50 },
    { id: 9, name: "Microondas", price: 200 },
    { id: 10, name: "Mochila", price: 60 },
    { id: 11, name: "Reloj", price: 400 },
    { id: 12, name: "Zapatos", price: 120 },
    { id: 13, name: "Mesa", price: 150 },
    { id: 14, name: "Bocina", price: 180 },
    { id: 15, name: "Aire Acondicionado", price: 600 },
    { id: 16, name: "Ventilador", price: 100 },
    { id: 17, name: "Licuadora", price: 90 },
    { id: 18, name: "Horno", price: 500 },
    { id: 19, name: "Tableta", price: 400 },
    { id: 20, name: "Auriculares Bluetooth", price: 120 },
];

export default function Home() {
    const [productosConImagen, setProductosConImagen] = useState<Product[]>([]);
    const [carrito, setCarrito] = useState<Product[]>([]);
    const [progreso, setProgreso] = useState(0);
    const presupuestoMaximo = 2000;
    const [mensajeAlerta, setMensajeAlerta] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const cargarImagenesParaProductos = async () => {
            const productosActualizados = await Promise.all(
                productosDisponibles.map(async (producto) => {
                    const imagen = await obtenerImagenes(producto.name);
                    return { ...producto, image: imagen };
                })
            );
            setProductosConImagen(productosActualizados);
        };

        cargarImagenesParaProductos();
    }, []);

    const agregarAlCarrito = (producto: Product) => {
        const totalActual = carrito.reduce(
            (suma, item) => suma + item.price,
            0
        );
        if (totalActual + producto.price > presupuestoMaximo) {
            setMensajeAlerta(
                `Agregar ${producto.name} excede el presupuesto máximo de $${presupuestoMaximo}.`
            );
            return;
        }

        setMensajeAlerta(null);
        setCarrito((prevCarrito) => [...prevCarrito, producto]);
        actualizarProgreso([...carrito, producto]);
    };

    const eliminarDelCarrito = (productoId: number) => {
        const carritoActualizado = carrito.filter(
            (item) => item.id !== productoId
        );
        setCarrito(carritoActualizado);
        actualizarProgreso(carritoActualizado);
    };

    const actualizarProgreso = (carritoActualizado: Product[]) => {
        const total = carritoActualizado.reduce(
            (suma, item) => suma + item.price,
            0
        );
        setProgreso(Math.min((total / presupuestoMaximo) * 100, 100));
    };

    const manejarCompra = () => {
        setCarrito([]);
        setProgreso(0);
        setMensajeAlerta(null);
        toast({
            title: "Compra Exitosa",
            description:
                "¡Gracias por tu compra! Tu pedido ha sido realizado con éxito.",
            variant: "default",
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Encabezado */}
            <header className="bg-gray-800 text-white py-4 shadow-md sticky top-0 z-10">
                <h1 className="text-center text-3xl font-bold">
                    Carrito de Compras
                </h1>
            </header>

            <div className="p-4">
                {/* Alerta de Presupuesto Excedido */}
                {mensajeAlerta && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Presupuesto Excedido</AlertTitle>
                        <AlertDescription>{mensajeAlerta}</AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="productos">
                    <TabsList className="mb-4">
                        <TabsTrigger value="productos">Productos</TabsTrigger>
                        <TabsTrigger value="carrito">Tu Carrito</TabsTrigger>
                    </TabsList>

                    <TabsContent value="productos">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                            {productosConImagen.map((producto) => (
                                <ProductCard
                                    key={producto.id}
                                    product={producto}
                                    onAddToCart={agregarAlCarrito}
                                    isInCart={carrito.some(
                                        (item) => item.id === producto.id
                                    )}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="carrito">
                        {carrito.length > 0 ? (
                            <div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                                    {carrito.map((producto) => (
                                        <ProductCard
                                            key={producto.id}
                                            product={producto}
                                            isInCart={true}
                                            onRemoveFromCart={
                                                eliminarDelCarrito
                                            }
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={manejarCompra}
                                    className="mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded shadow hover:bg-green-600"
                                >
                                    Finalizar Compra
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                Tu carrito está vacío.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {carrito.length > 0 && (
                    <div className="mt-6 bg-white p-4 rounded shadow-md">
                        <h2 className="text-lg font-semibold mb-2">
                            Progreso de Compra
                        </h2>
                        <Progress value={progreso} className="h-3" />
                        <p className="mt-2 text-sm text-gray-600">
                            Total: $
                            {carrito.reduce(
                                (suma, item) => suma + item.price,
                                0
                            )}{" "}
                            / ${presupuestoMaximo}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
