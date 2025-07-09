import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { colors, typography, spacing } from '../tokens';

interface ProductItem {
  uri: string;
  id: string;
}

interface ProductWheelProps {
  products: ProductItem[];
  outerRadius?: number;
  innerNodeDiameter?: number;
  itemSize?: number;
}

export const ProductWheel: React.FC<ProductWheelProps> = ({
  products,
  outerRadius = 180,
  innerNodeDiameter = 164,
  itemSize = 56
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle auto-rotation (4 seconds)
    const rotateAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
      { iterations: -1 }
    );

    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, []);

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderProducts = () => {
    const visibleProducts = products.slice(0, 10); // Max 10 products
    const angleStep = (2 * Math.PI) / visibleProducts.length;

    return visibleProducts.map((product, index) => {
      const angle = index * angleStep;
      const x = outerRadius * Math.cos(angle - Math.PI / 2); // Start from top
      const y = outerRadius * Math.sin(angle - Math.PI / 2);

      return (
        <View
          key={product.id}
          style={[
            styles.productItem,
            {
              width: itemSize,
              height: itemSize,
              transform: [
                { translateX: x },
                { translateY: y },
              ],
            },
          ]}
        >
          <Image 
            source={{ uri: product.uri }} 
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
      );
    });
  };

  return (
    <View style={[styles.container, { width: (outerRadius + itemSize) * 2, height: (outerRadius + itemSize) * 2 }]}>
      <Animated.View 
        style={[
          styles.wheelContainer,
          { transform: [{ rotate: rotation }] }
        ]}
      >
        {renderProducts()}
      </Animated.View>
      
      {/* Central node */}
      <View style={[
        styles.centerNode,
        {
          width: innerNodeDiameter,
          height: innerNodeDiameter,
          borderRadius: innerNodeDiameter / 2,
        }
      ]}>
        <Text style={styles.centerGlyph}>?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: spacing.xl,
  },
  wheelContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productItem: {
    position: 'absolute',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.surfaceNeutral,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  centerNode: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    // Radial gradient effect using multiple layers
    backgroundColor: '#FF7CAB',
    shadowColor: '#FFB6C7',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  centerGlyph: {
    fontSize: typography.fontSizes.displayXL,
    fontWeight: typography.fontWeights.bold,
    color: '#FFFFFF',
    fontFamily: typography.fontFamilies.display,
  },
}); 