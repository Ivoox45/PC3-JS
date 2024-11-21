import axios from "axios";

const API_KEY = "47204114-336a923f64f4f968ef322869d";
const API_URL = "https://pixabay.com/api/";

export const obtenerImagenes = async (
    query: string
): Promise<string | null> => {
    if (!query || query.trim() === "") {
        console.warn("El término de búsqueda está vacío");
        return null;
    }

    try {
        const response = await axios.get(API_URL, {
            params: {
                key: API_KEY,
                q: query, 
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
                per_page: 3, 
            },
        });

        console.log("Respuesta de Pixabay:", response.data); 
        if (response.data.hits && response.data.hits.length > 0) {
            return response.data.hits[0].webformatURL; 
        } else {
            console.warn(`No se encontraron imágenes para: ${query}`);
            return null;
        }
    } catch (error: any) {
        if (error.response?.status === 429) {
            console.error("Límite de llamadas excedido. Intenta más tarde.");
        } else if (error.response?.status === 400) {
            console.error("Solicitud inválida. Verifica los parámetros.");
        } else {
            console.error(
                "Error al obtener la imagen:",
                error.message,
                error.response?.data
            );
        }
        return null;
    }
};
