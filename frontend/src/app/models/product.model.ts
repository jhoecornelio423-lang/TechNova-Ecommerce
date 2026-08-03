export interface Category {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    precioAnterior?: number;
    stock: number;
    imagenUrl: string;
    categoria: Category;
    talla: string;
    color: string;
}
