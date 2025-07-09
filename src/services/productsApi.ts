/**
 * Products API Service
 * Handles all product-related API calls including recommendations
 */

import { ApiService } from './api';

// Product data types based on backend schema
export interface ProductIngredients {
    active_ingredients?: string[];
    full_ingredients?: string[];
    concerns?: string[];
    skin_types?: string[];
}

export interface Product {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    brand: string;
    category: string;
    description?: string;
    product_url?: string;
    image_url?: string;
    price?: number;
    currency: string;
    size?: string;
    ingredients?: ProductIngredients;
    rating?: number;
    review_count?: number;
    availability: string;
    source: string;
}

export interface RecommendedProduct extends Product {
    recommendation_score: number;
    recommendation_reason: string;
    matches_criteria: string[];
}

export interface ProductListResponse {
    products: Product[];
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
}

export interface ProductRecommendationRequest {
    analysis_id: string;
    budget_range?: 'budget' | 'mid_range' | 'luxury';
    preferred_brands?: string[];
    exclude_ingredients?: string[];
    routine_step?: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment';
    max_products?: number;
}

export interface ProductRecommendationResponse {
    analysis_id: string;
    recommendations: RecommendedProduct[];
    total_found: number;
    criteria_used: Record<string, any>;
    generated_at: string;
}

export interface ProductSearchRequest {
    query?: string;
    categories?: string[];
    brands?: string[];
    skin_types?: string[];
    skin_concerns?: string[];
    ingredients?: string[];
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    availability?: string[];
    skip?: number;
    limit?: number;
    sort_by?: 'name' | 'price' | 'rating' | 'created_at';
    sort_order?: 'asc' | 'desc';
}

export interface ProductFilters {
    category?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
    search?: string;
    page?: number;
    limit?: number;
}

export class ProductsApiService extends ApiService {
    private readonly endpoints = {
        products: '/api/v1/products',
        categories: '/api/v1/products/categories',
        brands: '/api/v1/products/brands',
        search: '/api/v1/products/search',
        recommendations: '/api/v1/products/recommendations',
        byId: (id: string) => `/api/v1/products/${id}`,
    };

    /**
     * List products with optional filtering
     */
    async listProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
        const params = new URLSearchParams();

        if (filters.page) {
            const skip = (filters.page - 1) * (filters.limit || 20);
            params.append('skip', skip.toString());
        }
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.category) params.append('category', filters.category);
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.min_price) params.append('min_price', filters.min_price.toString());
        if (filters.max_price) params.append('max_price', filters.max_price.toString());
        if (filters.search) params.append('search', filters.search);

        const queryString = params.toString();
        const url = queryString ? `${this.endpoints.products}?${queryString}` : this.endpoints.products;

        return this.get<ProductListResponse>(url);
    }

    /**
     * Get product by ID
     */
    async getProduct(productId: string): Promise<Product> {
        return this.get<Product>(this.endpoints.byId(productId));
    }

    /**
     * Get all available product categories
     */
    async getProductCategories(): Promise<string[]> {
        return this.get<string[]>(this.endpoints.categories);
    }

    /**
     * Get all available product brands
     */
    async getProductBrands(): Promise<string[]> {
        return this.get<string[]>(this.endpoints.brands);
    }

    /**
     * Advanced product search with multiple criteria
     */
    async searchProducts(searchRequest: ProductSearchRequest): Promise<ProductListResponse> {
        return this.post<ProductListResponse>(this.endpoints.search, searchRequest);
    }

    /**
     * Get personalized product recommendations based on skin analysis (updated for OpenAPI)
     */
    async getProductRecommendations(request: ProductRecommendationRequest): Promise<ProductRecommendationResponse> {
        console.log('🎯 Fetching personalized product recommendations...', request);
        try {
            const data = await this.post<ProductRecommendationResponse>(
                this.endpoints.recommendations,
                request
            );
            console.log('✅ Product recommendations fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch product recommendations:', error);
            throw error;
        }
    }

    /**
     * Helper: Search products by text query
     */
    async searchProductsByQuery(
        query: string,
        page = 1,
        limit = 20
    ): Promise<ProductListResponse> {
        return this.searchProducts({
            query,
            skip: (page - 1) * limit,
            limit,
            sort_by: 'rating',
            sort_order: 'desc',
        });
    }

    /**
     * Helper: Get products by category
     */
    async getProductsByCategory(
        category: string,
        page = 1,
        limit = 20
    ): Promise<ProductListResponse> {
        return this.listProducts({
            category,
            page,
            limit,
        });
    }

    /**
     * Helper: Get products by brand
     */
    async getProductsByBrand(
        brand: string,
        page = 1,
        limit = 20
    ): Promise<ProductListResponse> {
        return this.listProducts({
            brand,
            page,
            limit,
        });
    }

    /**
     * Helper: Get products in price range
     */
    async getProductsInPriceRange(
        minPrice: number,
        maxPrice: number,
        page = 1,
        limit = 20
    ): Promise<ProductListResponse> {
        return this.listProducts({
            min_price: minPrice,
            max_price: maxPrice,
            page,
            limit,
        });
    }

    /**
     * Helper: Get recommended products for specific routine step
     */
    async getRoutineStepRecommendations(
        analysisId: string,
        routineStep: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment',
        budgetRange?: 'budget' | 'mid_range' | 'luxury'
    ): Promise<ProductRecommendationResponse> {
        return this.getProductRecommendations({
            analysis_id: analysisId,
            routine_step: routineStep,
            budget_range: budgetRange,
            max_products: 5,
        });
    }

    /**
     * Helper: Get budget-friendly recommendations
     */
    async getBudgetRecommendations(
        analysisId: string,
        maxProducts = 10
    ): Promise<ProductRecommendationResponse> {
        return this.getProductRecommendations({
            analysis_id: analysisId,
            budget_range: 'budget',
            max_products: maxProducts,
        });
    }

    /**
     * Helper: Get luxury recommendations
     */
    async getLuxuryRecommendations(
        analysisId: string,
        maxProducts = 10
    ): Promise<ProductRecommendationResponse> {
        return this.getProductRecommendations({
            analysis_id: analysisId,
            budget_range: 'luxury',
            max_products: maxProducts,
        });
    }

    /**
     * Helper: Search products for specific skin concerns
     */
    async searchProductsForConcerns(
        skinConcerns: string[],
        page = 1,
        limit = 20
    ): Promise<ProductListResponse> {
        return this.searchProducts({
            skin_concerns: skinConcerns,
            skip: (page - 1) * limit,
            limit,
            sort_by: 'rating',
            sort_order: 'desc',
        });
    }

    /**
     * Helper: Get products suitable for skin type
     */
    async getProductsForSkinType(
        skinType: string,
        page = 1,
        limit = 20
    ): Promise<ProductListResponse> {
        return this.searchProducts({
            skin_types: [skinType],
            skip: (page - 1) * limit,
            limit,
            sort_by: 'rating',
            sort_order: 'desc',
        });
    }
}

// Export singleton instance
export const productsApi = new ProductsApiService(); 