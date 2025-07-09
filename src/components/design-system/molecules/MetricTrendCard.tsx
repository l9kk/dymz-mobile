import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, Path } from 'react-native-svg';
import { colors, typography, spacing } from '../tokens';

interface DataPoint {
  week: number;
  score: number;
}

interface MetricTrendCardProps {
  metricName?: string;
  title?: string; // Add title as alternative prop
  dataPoints: DataPoint[];
  currentScore: number;
  change: number;
  height?: number;
  style?: any;
}

const CHART_PADDING = 40;
const CHART_WIDTH = Dimensions.get('window').width - (spacing.l * 2) - (CHART_PADDING * 2);
const CHART_HEIGHT = 180;

export const MetricTrendCard: React.FC<MetricTrendCardProps> = ({
  metricName,
  title,
  dataPoints,
  currentScore,
  change,
  height = 320,
  style
}) => {
  // Calculate chart dimensions and scales
  const minScore = Math.min(...dataPoints.map(d => d.score), 0);
  const maxScore = Math.max(...dataPoints.map(d => d.score), 100);
  const scoreRange = maxScore - minScore;
  
  // Generate SVG path for line chart
  const generatePath = () => {
    if (dataPoints.length < 2) return '';
    
    const points = dataPoints.map((point, index) => {
      const x = (index / (dataPoints.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - ((point.score - minScore) / scoreRange) * CHART_HEIGHT;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Generate grid lines
  const generateGridLines = () => {
    const lines = [];
    const gridLines = 4;
    
    // Horizontal grid lines
    for (let i = 0; i <= gridLines; i++) {
      const y = (i / gridLines) * CHART_HEIGHT;
      lines.push(
        <Line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={CHART_WIDTH}
          y2={y}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={1}
          strokeDasharray="4,4"
        />
      );
    }
    
    return lines;
  };

  // Generate data point circles
  const generateDataPoints = () => {
    return dataPoints.map((point, index) => {
      const x = (index / (dataPoints.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - ((point.score - minScore) / scoreRange) * CHART_HEIGHT;
      
      return (
        <Circle
          key={index}
          cx={x}
          cy={y}
          r={4}
          fill={colors.accentPalette[2]}
          stroke={colors.trendChartStroke}
          strokeWidth={2}
        />
      );
    });
  };

  const changeIndicator = change >= 0 ? '+' : '';
  const changeColor = change >= 0 ? colors.accentPalette[4] : '#FF6B6B';

  return (
    <View style={[styles.container, { height }, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title || metricName}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.currentScore}>{currentScore}</Text>
          <Text style={[styles.change, { color: changeColor }]}>
            {changeIndicator}{change}
          </Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT} style={styles.chart}>
          {generateGridLines()}
          <Path
            d={generatePath()}
            stroke={colors.trendChartStroke}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {generateDataPoints()}
        </Svg>
        
        <View style={styles.axisLabels}>
          <Text style={styles.axisLabel}>Week 1</Text>
          <Text style={styles.axisLabel}>Week {dataPoints.length}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceNeutralTint,
    borderRadius: 12,
    padding: spacing.l,
    marginHorizontal: spacing.s,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  title: {
    fontSize: typography.fontSizes.bodyL,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  currentScore: {
    fontSize: typography.fontSizes.displayL,
    fontFamily: typography.fontFamilies.display,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  change: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.body,
    fontWeight: typography.fontWeights.semibold,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    backgroundColor: 'transparent',
  },
  axisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CHART_WIDTH,
    marginTop: spacing.s,
  },
  axisLabel: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.body,
    color: colors.textSecondary,
  },
}); 