/**
 * Products React Query Hooks
 * Manages all product-related data fetching and mutations
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ProductsApiService,
    Product,
    ProductListResponse,
    ProductRecommendationRequest,
    ProductRecommendationResponse,
    ProductSearchRequest,
    ProductFilters
} from '../../services/productsApi';

// Create products API service instance
const productsApi = new ProductsApiService();

// Query keys for React Query
export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
    categories: () => [...productKeys.all, 'categories'] as const,
    brands: () => [...productKeys.all, 'brands'] as const,
    search: (query: string) => [...productKeys.all, 'search', query] as const,
    recommendations: (analysisId: string) => [...productKeys.all, 'recommendations', analysisId] as const,
    routineStep: (analysisId: string, step: string) => [...productKeys.all, 'routineStep', analysisId, step] as const,
};

/**
 * Hook for listing products with filters
 */
export const useProducts = (filters: ProductFilters = {}, enabled = true) => {
    return useQuery({
        queryKey: productKeys.list(filters),
        queryFn: () => productsApi.listProducts(filters),
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: (previousData) => previousData,
    });
};

/**
 * Hook for getting a single product by ID
 */
export const useProduct = (productId: string, enabled = true) => {
    return useQuery({
        queryKey: productKeys.detail(productId),
        queryFn: () => productsApi.getProduct(productId),
        enabled: enabled && !!productId,
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
};

/**
 * Hook for getting product categories
 */
export const useProductCategories = (enabled = true) => {
    return useQuery({
        queryKey: productKeys.categories(),
        queryFn: () => productsApi.getProductCategories(),
        enabled,
        staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
    });
};

/**
 * Hook for getting product brands
 */
export const useProductBrands = (enabled = true) => {
    return useQuery({
        queryKey: productKeys.brands(),
        queryFn: () => productsApi.getProductBrands(),
        enabled,
        staleTime: 30 * 60 * 1000, // 30 minutes
    });
};

/**
 * Hook for product search
 */
export const useProductSearch = (searchRequest: ProductSearchRequest, enabled = true) => {
    return useQuery({
        queryKey: productKeys.search(JSON.stringify(searchRequest)),
        queryFn: () => productsApi.searchProducts(searchRequest),
        enabled: enabled && !!searchRequest.query,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook for getting product recommendations based on analysis
 */
export const useProductRecommendations = (
    request: ProductRecommendationRequest,
    enabled = true
) => {
    // Strict validation to prevent invalid API calls
    const isValidRequest = Boolean(
        request.analysis_id &&
        request.analysis_id.trim() !== '' &&
        request.analysis_id !== 'undefined' &&
        request.analysis_id !== 'null'
    );

    return useQuery({
        queryKey: productKeys.recommendations(request.analysis_id),
        queryFn: () => {
            // Double-check validation before making API call
            if (!isValidRequest) {
                throw new Error('Valid analysis_id is required for product recommendations');
            }
            return productsApi.getProductRecommendations(request);
        },
        enabled: enabled && isValidRequest,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            // Don't retry for validation errors (400) or analysis not completed errors
            if (error?.status === 400 && error?.message?.includes('Analysis must be completed')) {
                console.warn('🚫 Product recommendations unavailable: Analysis not completed');
                return false;
            }
            if (error?.status === 404) return false;
            return failureCount < 2; // Reduced retry attempts
        },
    });
};

/**
 * Hook for getting routine step specific recommendations
 */
export const useRoutineStepRecommendations = (
    analysisId: string,
    routineStep: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment',
    budgetRange?: 'budget' | 'mid_range' | 'luxury',
    enabled = true
) => {
    // Strict validation to prevent invalid API calls
    const isValidRequest = Boolean(
        analysisId &&
        analysisId.trim() !== '' &&
        analysisId !== 'undefined' &&
        analysisId !== 'null'
    );

    return useQuery({
        queryKey: productKeys.routineStep(analysisId, routineStep),
        queryFn: () => {
            if (!isValidRequest) {
                throw new Error('Valid analysis_id is required for routine step recommendations');
            }
            return productsApi.getRoutineStepRecommendations(analysisId, routineStep, budgetRange);
        },
        enabled: enabled && isValidRequest,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
            if (error?.status === 400 && error?.message?.includes('Analysis must be completed')) {
                console.warn('🚫 Routine step recommendations unavailable: Analysis not completed');
                return false;
            }
            return failureCount < 2;
        },
    });
};

/**
 * Hook for searching products by text query
 */
export const useProductSearchByQuery = (
    query: string,
    page = 1,
    limit = 20,
    enabled = true
) => {
    return useQuery({
        queryKey: productKeys.search(`${query}-${page}-${limit}`),
        queryFn: () => productsApi.searchProductsByQuery(query, page, limit),
        enabled: enabled && !!query.trim(),
        staleTime: 2 * 60 * 1000,
    });
};

/**
 * Hook for getting products by category
 */
export const useProductsByCategory = (
    category: string,
    page = 1,
    limit = 20,
    enabled = true
) => {
    return useQuery({
        queryKey: productKeys.list({ category, page, limit }),
        queryFn: () => productsApi.getProductsByCategory(category, page, limit),
        enabled: enabled && !!category,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Hook for getting products by brand
 */
export const useProductsByBrand = (
    brand: string,
    page = 1,
    limit = 20,
    enabled = true
) => {
    return useQuery({
        queryKey: productKeys.list({ brand, page, limit }),
        queryFn: () => productsApi.getProductsByBrand(brand, page, limit),
        enabled: enabled && !!brand,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Hook for getting budget-friendly recommendations
 */
export const useBudgetRecommendations = (
    analysisId: string,
    maxProducts = 10,
    enabled = true
) => {
    // Strict validation to prevent invalid API calls
    const isValidRequest = Boolean(
        analysisId &&
        analysisId.trim() !== '' &&
        analysisId !== 'undefined' &&
        analysisId !== 'null'
    );

    return useQuery({
        queryKey: [...productKeys.recommendations(analysisId), 'budget'],
        queryFn: () => {
            if (!isValidRequest) {
                throw new Error('Valid analysis_id is required for budget recommendations');
            }
            return productsApi.getBudgetRecommendations(analysisId, maxProducts);
        },
        enabled: enabled && isValidRequest,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
            if (error?.status === 400 && error?.message?.includes('Analysis must be completed')) {
                console.warn('🚫 Budget recommendations unavailable: Analysis not completed');
                return false;
            }
            return failureCount < 2;
        },
    });
};

/**
 * Hook for getting luxury recommendations
 */
export const useLuxuryRecommendations = (
    analysisId: string,
    maxProducts = 10,
    enabled = true
) => {
    // Strict validation to prevent invalid API calls
    const isValidRequest = Boolean(
        analysisId &&
        analysisId.trim() !== '' &&
        analysisId !== 'undefined' &&
        analysisId !== 'null'
    );

    return useQuery({
        queryKey: [...productKeys.recommendations(analysisId), 'luxury'],
        queryFn: () => {
            if (!isValidRequest) {
                throw new Error('Valid analysis_id is required for luxury recommendations');
            }
            return productsApi.getLuxuryRecommendations(analysisId, maxProducts);
        },
        enabled: enabled && isValidRequest,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
            if (error?.status === 400 && error?.message?.includes('Analysis must be completed')) {
                console.warn('🚫 Luxury recommendations unavailable: Analysis not completed');
                return false;
            }
            return failureCount < 2;
        },
    });
};

/**
 * Hook for getting products for specific skin concerns
 */
export const useProductsForConcerns = (
    skinConcerns: string[],
    page = 1,
    limit = 20,
    enabled = true
) => {
    return useQuery({
        queryKey: [...productKeys.all, 'concerns', skinConcerns, page, limit],
        queryFn: () => productsApi.searchProductsForConcerns(skinConcerns, page, limit),
        enabled: enabled && skinConcerns.length > 0,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Hook for getting products for specific skin type
 */
export const useProductsForSkinType = (
    skinType: string,
    page = 1,
    limit = 20,
    enabled = true
) => {
    return useQuery({
        queryKey: [...productKeys.all, 'skinType', skinType, page, limit],
        queryFn: () => productsApi.getProductsForSkinType(skinType, page, limit),
        enabled: enabled && !!skinType,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Hook for prefetching product data
 */
export const usePrefetchProducts = () => {
    const queryClient = useQueryClient();

    return {
        prefetchCategories: () => {
            queryClient.prefetchQuery({
                queryKey: productKeys.categories(),
                queryFn: () => productsApi.getProductCategories(),
                staleTime: 30 * 60 * 1000,
            });
        },

        prefetchBrands: () => {
            queryClient.prefetchQuery({
                queryKey: productKeys.brands(),
                queryFn: () => productsApi.getProductBrands(),
                staleTime: 30 * 60 * 1000,
            });
        },

        prefetchPopularProducts: () => {
            queryClient.prefetchQuery({
                queryKey: productKeys.list({ page: 1, limit: 20 }),
                queryFn: () => productsApi.listProducts({ page: 1, limit: 20 }),
                staleTime: 5 * 60 * 1000,
            });
        },
    };
};

/**
 * Helper hook for getting products by multiple criteria
 */
export const useAdvancedProductSearch = () => {
    const [searchState, setSearchState] = useState<ProductSearchRequest>({});

    const searchQuery = useProductSearch(searchState, Object.keys(searchState).length > 0);

    const search = (criteria: ProductSearchRequest) => {
        setSearchState(criteria);
    };

    const clearSearch = () => {
        setSearchState({});
    };

    return {
        searchResults: searchQuery.data,
        isLoading: searchQuery.isLoading,
        error: searchQuery.error,
        search,
        clearSearch,
    };
};

// Export the products API service instance for direct use if needed
export { productsApi }; 