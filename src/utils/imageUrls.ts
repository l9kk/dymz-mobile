// Central configuration for UI content images and local product icons
// Product images now use local assets for better performance and offline support

// Local product icon imports
const ProductIcons = {
    cleanser: require('../../assets/products/cleanser.png'),
    serum: require('../../assets/products/serum.png'),
    moisturizer: require('../../assets/products/moisturizer.png'),
    sunscreen: require('../../assets/products/sunscreen.png'),
    general: require('../../assets/products/genera-for-everything.png')
};

export const ImageUrls = {
    // Portrait examples for selfie guidance - UI content, not products
    goodSelfies: [
        'https://images.unsplash.com/photo-1713207524097-596f3c17afc3?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Good lighting - clear face
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', // Direct angle - professional
        'https://images.unsplash.com/photo-1730288951113-9cc087c14b83?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Clear skin - good example
    ],

    badSelfies: [
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Too dark
        'https://images.unsplash.com/photo-1647718906350-b5d4d22402d6?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1647718906350-b5d4d22402d6?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Blurry
        'https://images.unsplash.com/photo-1572651203008-39a6c9307453?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Side angle
    ],

    // Feature tile images for value propositions - UI content
    features: {
        ingredientAnalysis: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=120&h=120&fit=crop', // Lab/science imagery
        personalizedMatching: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=120&h=120&fit=crop', // Custom skincare
        databaseSearch: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=120&h=120&fit=crop', // Product variety
        aiAnalysis: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=120&h=120&fit=crop', // Tech/AI imagery
    },

    // Background images for various contexts - UI content
    backgrounds: {
        splash: 'https://images.unsplash.com/photo-1556228578-f9f3f3b3f3b3?w=400&h=600&fit=crop',
        onboarding: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=600&fit=crop',
    },

    // Motivation lifestyle images for Block 6 - UI content for onboarding
    motivation: {
        selfCare: 'https://images.unsplash.com/photo-1595284842888-519573d8fb7b?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Beautiful skincare routine
        confidence: 'https://plus.unsplash.com/premium_photo-1732737781554-004f4f15ec42?q=80&w=1130&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Confident woman
        wellness: 'https://plus.unsplash.com/premium_photo-1681408058651-1c904ecf2e01?q=80&w=1125&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Wellness/spa vibes
        glow: 'https://images.unsplash.com/photo-1609175215545-3b41b17d9e1e?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Healthy glowing skin
    },

    // Statement card backgrounds for survey questions - UI content for onboarding
    statements: {
        skinStruggles: 'https://images.unsplash.com/photo-1734120273696-596f96658db9?q=80&w=929&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Relatable skin concerns
        timeConstraints: 'https://images.unsplash.com/photo-1646446852987-9286f631b2b8?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Busy lifestyle
        confusedAboutProducts: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product confusion
        skincare_frustration_2: 'https://images.unsplash.com/photo-1583264277162-da442576693d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Frustration with skin goals
        trendingProductsBuying: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Social media product buying
    },

    // Social video thumbnails for Block 7 - UI content for social proof
    socialVideos: {
        skincareRoutine: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=164&h=164&fit=crop', // Skincare routine video
        productReview: 'https://images.unsplash.com/photo-1556228578-0d61a9d4ceea?w=164&h=164&fit=crop', // Product review video
        beforeAfter: 'https://images.unsplash.com/photo-1494790108755-2616c768e898?w=164&h=164&fit=crop&crop=face', // Before/after results
        trendsUpdate: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=164&h=164&fit=crop', // Trends update video
    },

    // Collage images for statement cards (6 images for 2x3 grid) - UI content for onboarding
    collageImages: {
        trendingProducts: [
            'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Original trendy products image
            'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Skincare products array
            'https://images.unsplash.com/photo-1629198726990-2ed2bb15d2f8?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Beauty products display
            'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Skincare routine products
            'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Modern skincare bottles
            'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // Trendy beauty products
        ],
    },

    // Avatar/testimonial images for social proof components
    avatars: [
        'https://images.unsplash.com/photo-1553514029-1318c9127859?w=50&h=50&fit=crop&crop=face', // Avatar 1
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face', // Avatar 2
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face', // Avatar 3
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', // Avatar 4
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=50&h=50&fit=crop&crop=face', // Avatar 5
    ],

    // Local product icons - using custom assets for consistent branding
    products: {
        // Cleansers - all use cleanser icon
        ceraveFoamingCleanser: ProductIcons.cleanser,
        neutrogenaGentleCleanser: ProductIcons.cleanser,
        laRochePosayCleanser: ProductIcons.cleanser,

        // Serums - all use serum icon
        ordinaryNiacinamide: ProductIcons.serum,
        skinceuticalsVitaminC: ProductIcons.serum,
        hyaluronicAcidSerum: ProductIcons.serum,
        retinolSerum: ProductIcons.serum,

        // Moisturizers - all use moisturizer icon
        ceraveDailyMoisturizer: ProductIcons.moisturizer,
        olayCreamyMoisturizer: ProductIcons.moisturizer,
        cliniqueMoisturizer: ProductIcons.moisturizer,
        neutrogenaHydrating: ProductIcons.moisturizer,

        // Sunscreens - all use sunscreen icon
        eltaMdSunscreen: ProductIcons.sunscreen,
        laRochePosaySunscreen: ProductIcons.sunscreen,
        neutrogenaUltraSheer: ProductIcons.sunscreen,
        ceraveSunscreen: ProductIcons.sunscreen,

        // Treatments - use serum icon for treatment products
        ordinaryAHA: ProductIcons.serum,
        retinolCream: ProductIcons.moisturizer,
        salicylicAcidToner: ProductIcons.serum,
        benzoylPeroxide: ProductIcons.serum,

        // Eye care - use serum icon for eye serums, moisturizer for creams
        caffeineEyeSerum: ProductIcons.serum,
        retinolEyeCream: ProductIcons.moisturizer,
        hyaluronicEyeGel: ProductIcons.serum,

        // Masks & Treatments - use general icon for masks
        clayMask: ProductIcons.general,
        sheetMask: ProductIcons.general,
        overnightMask: ProductIcons.moisturizer,
        enzymeMask: ProductIcons.general,
    }
};

// Helper functions for image access
export const getGoodSelfieExamples = (): string[] => {
    return ImageUrls.goodSelfies;
};

export const getBadSelfieExamples = (): string[] => {
    return ImageUrls.badSelfies;
};

export const getFeatureImage = (feature: keyof typeof ImageUrls.features): string => {
    return ImageUrls.features[feature];
};

export const getMotivationImageArray = (): string[] => {
    return Object.values(ImageUrls.motivation);
};

export const getStatementImageByKey = (key: keyof typeof ImageUrls.statements): string => {
    return ImageUrls.statements[key];
};

export const getSocialVideoImageArray = (): string[] => {
    return Object.values(ImageUrls.socialVideos);
};

export const getCollageImagesByCategory = (category: keyof typeof ImageUrls.collageImages): string[] => {
    return ImageUrls.collageImages[category] || [];
};

// Legacy function name support (deprecated - use getCollageImagesByCategory)
export const getCollageImagesByKey = (key: keyof typeof ImageUrls.collageImages): string[] => {
    return getCollageImagesByCategory(key);
};

// Product image helper - for legacy support with local icons
export const getProductImageByIndex = (index: number): any => {
    const productIcons = [
        ProductIcons.cleanser,
        ProductIcons.serum,
        ProductIcons.moisturizer,
        ProductIcons.sunscreen,
        ProductIcons.general
    ];
    return productIcons[index % productIcons.length];
};

// Testimonial/avatar helper functions
export const getTestimonialAvatars = (): string[] => {
    return [
        'https://images.unsplash.com/photo-1553514029-1318c9127859?w=50&h=50&fit=crop&crop=face', // Avatar 1
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face', // Avatar 2
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face', // Avatar 3
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', // Avatar 4
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=50&h=50&fit=crop&crop=face', // Avatar 5
    ];
};

// Social video helper function
export const getSocialVideoImageByKey = (key: string): string => {
    const videos = getSocialVideoImageArray();
    return videos[0] || videos[Math.floor(Math.random() * videos.length)];
};

// Skin issues helper function
export const getSkinIssueImages = (): string[] => {
    return [
        'https://images.unsplash.com/photo-1660646463659-df77c1580723?w=148&h=148&fit=crop', // Skincare product application
        'https://images.unsplash.com/photo-1730288951113-9cc087c14b83?w=148&h=148&fit=crop', // Modern skincare routine
        'https://plus.unsplash.com/premium_photo-1664203068177-2641a2a55a4e?w=148&h=148&fit=crop', // Professional skin analysis
        'https://images.unsplash.com/photo-1712847333364-296afd7ba69a?w=148&h=148&fit=crop', // Healthy skin goals
    ];
};

// Product image helper functions
export const getProductImageByName = (productName: keyof typeof ImageUrls.products): string => {
    return ImageUrls.products[productName];
};

export const getAllMockProductImages = (): any[] => {
    return Object.values(ImageUrls.products);
};

export const getRandomMockProductImage = (): any => {
    const productIcons = [
        ProductIcons.cleanser,
        ProductIcons.serum,
        ProductIcons.moisturizer,
        ProductIcons.sunscreen,
        ProductIcons.general
    ];
    return productIcons[Math.floor(Math.random() * productIcons.length)];
};

// Export ProductIcons for direct access to local assets
export { ProductIcons };

// Helper function to get all available product icons
export const getAllProductIcons = (): any[] => {
    return [
        ProductIcons.cleanser,
        ProductIcons.serum,
        ProductIcons.moisturizer,
        ProductIcons.sunscreen,
        ProductIcons.general
    ];
};

export const getProductIconByCategory = (category: 'cleanser' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment' | 'eye' | 'mask'): any => {
    const categoryMap = {
        cleanser: ProductIcons.cleanser,
        serum: ProductIcons.serum,
        moisturizer: ProductIcons.moisturizer,
        sunscreen: ProductIcons.sunscreen,
        treatment: ProductIcons.serum, // treatments typically use serum icon
        eye: ProductIcons.serum, // eye serums use serum icon
        mask: ProductIcons.general // masks use general icon
    };

    return categoryMap[category] || ProductIcons.general;
};

// Legacy support - returns array for compatibility
export const getMockProductImagesByCategory = (category: 'cleanser' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment' | 'eye' | 'mask'): any[] => {
    const icon = getProductIconByCategory(category);
    return [icon]; // Return single icon in array for compatibility
};

// Smart product icon matching with local assets and backend URL support
export const getProductImageUrl = (product: { image_url?: string; name?: string; category?: string }): any => {
    // Return backend image URL if available (as URI object for React Native)
    if (product.image_url) {
        return { uri: product.image_url };
    }

    // Match product name/category to appropriate local icon
    const productName = product.name?.toLowerCase() || '';
    const category = product.category?.toLowerCase() || '';

    // Category-based matching (most reliable)
    if (category.includes('cleanser') || productName.includes('cleanser') || productName.includes('wash') || productName.includes('foam')) {
        return ProductIcons.cleanser;
    }
    if (category.includes('serum') || productName.includes('serum') || productName.includes('essence') || productName.includes('treatment') || productName.includes('niacinamide') || productName.includes('vitamin c') || productName.includes('hyaluronic') || productName.includes('retinol')) {
        return ProductIcons.serum;
    }
    if (category.includes('moisturizer') || productName.includes('moisturizer') || productName.includes('cream') || productName.includes('lotion') || productName.includes('hydrat') || productName.includes('emulsion')) {
        return ProductIcons.moisturizer;
    }
    if (category.includes('sunscreen') || productName.includes('sunscreen') || productName.includes('spf') || productName.includes('sun protection') || productName.includes('uv')) {
        return ProductIcons.sunscreen;
    }

    // Brand-specific matching for exact product matches
    if (productName.includes('cerave') && productName.includes('cleanser')) return ProductIcons.cleanser;
    if (productName.includes('neutrogena') && productName.includes('cleanser')) return ProductIcons.cleanser;
    if (productName.includes('ordinary') && productName.includes('niacinamide')) return ProductIcons.serum;
    if (productName.includes('skinceuticals')) return ProductIcons.serum;
    if (productName.includes('elta') && productName.includes('md')) return ProductIcons.sunscreen;

    // Mask and specialty products use general icon
    if (category.includes('mask') || productName.includes('mask') || category.includes('treatment') || productName.includes('peel') || productName.includes('exfoliant')) {
        return ProductIcons.general;
    }

    // Final fallback - general product icon
    return ProductIcons.general;
}; 