/**
 * Image Compression Utilities
 * Handles image compression and resizing before upload to prevent 413 errors
 */

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: SaveFormat;
}

/**
 * Compress and resize an image for upload
 * Reduces file size while maintaining quality suitable for AI analysis
 */
export async function compressImageForUpload(
    imageUri: string,
    options: CompressionOptions = {}
): Promise<string> {
    const {
        maxWidth = 1024,
        maxHeight = 1024,
        quality = 0.8,
        format = SaveFormat.JPEG
    } = options;

    try {
        console.log('🔧 Starting image compression:', {
            originalUri: imageUri,
            maxWidth,
            maxHeight,
            quality,
            format
        });

        const manipulatedImage = await manipulateAsync(
            imageUri,
            [
                {
                    resize: {
                        width: maxWidth,
                        height: maxHeight,
                    },
                },
            ],
            {
                compress: quality,
                format: format,
                base64: false,
            }
        );

        console.log('✅ Image compression completed:', {
            originalUri: imageUri,
            compressedUri: manipulatedImage.uri,
            width: manipulatedImage.width,
            height: manipulatedImage.height
        });

        return manipulatedImage.uri;
    } catch (error) {
        console.error('❌ Image compression failed:', error);
        console.warn('⚠️ Using original image due to compression failure');
        return imageUri; // Fallback to original image
    }
}

/**
 * Get estimated file size reduction information
 */
export function getCompressionInfo(originalWidth: number, originalHeight: number, options: CompressionOptions = {}) {
    const { maxWidth = 1024, maxHeight = 1024, quality = 0.8 } = options;

    // Calculate aspect ratio preservation
    const aspectRatio = originalWidth / originalHeight;
    let newWidth = maxWidth;
    let newHeight = maxHeight;

    if (aspectRatio > 1) {
        // Landscape - limit by width
        newHeight = newWidth / aspectRatio;
    } else {
        // Portrait or square - limit by height
        newWidth = newHeight * aspectRatio;
    }

    const pixelReduction = (originalWidth * originalHeight) / (newWidth * newHeight);
    const estimatedSizeReduction = pixelReduction * (1 / quality);

    return {
        originalDimensions: { width: originalWidth, height: originalHeight },
        newDimensions: { width: Math.round(newWidth), height: Math.round(newHeight) },
        pixelReduction: Math.round(pixelReduction * 100) / 100,
        estimatedSizeReduction: Math.round(estimatedSizeReduction * 100) / 100,
        qualityReduction: Math.round((1 - quality) * 100)
    };
}

/**
 * Compression presets for different use cases
 */
export const CompressionPresets = {
    // High quality for analysis (recommended)
    ANALYSIS: {
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.85,
        format: SaveFormat.JPEG
    } as CompressionOptions,

    // Balanced quality and size
    BALANCED: {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
        format: SaveFormat.JPEG
    } as CompressionOptions,

    // Small size for previews
    PREVIEW: {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.7,
        format: SaveFormat.JPEG
    } as CompressionOptions,

    // Very small for thumbnails
    THUMBNAIL: {
        maxWidth: 256,
        maxHeight: 256,
        quality: 0.6,
        format: SaveFormat.JPEG
    } as CompressionOptions
};

/**
 * Helper to get file size information (estimate)
 */
export function estimateFileSizeReduction(
    originalDimensions: { width: number; height: number },
    compressionOptions: CompressionOptions = CompressionPresets.ANALYSIS
): {
    originalEstimateKB: number;
    compressedEstimateKB: number;
    reductionPercentage: number;
} {
    const { width: origW, height: origH } = originalDimensions;
    const info = getCompressionInfo(origW, origH, compressionOptions);

    // Rough estimate: 3 bytes per pixel for JPEG at full quality
    const originalEstimateKB = Math.round((origW * origH * 3) / 1024);
    const compressedEstimateKB = Math.round(originalEstimateKB / info.estimatedSizeReduction);
    const reductionPercentage = Math.round((1 - (compressedEstimateKB / originalEstimateKB)) * 100);

    return {
        originalEstimateKB,
        compressedEstimateKB,
        reductionPercentage
    };
} 