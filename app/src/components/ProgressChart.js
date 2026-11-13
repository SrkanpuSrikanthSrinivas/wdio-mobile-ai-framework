import { View, Text } from 'react-native';
import Svg, { Polyline, Line, Circle, Text as SvgText } from 'react-native-svg';
import { C } from '../theme';

/**
 * ProgressChart — a small real line chart (react-native-svg) of top weight over
 * sessions. Paired with an assertable summary line (~text-progress-summary) so
 * tests can verify it without reading pixels.
 */
export default function ProgressChart({ series = [], width = 300, height = 140 }) {
  const A = (id) => ({ testID: id, accessibilityLabel: id, accessible: true });

  if (series.length < 2) {
    return (
      <View {...A('chart-progress')}>
        <Text style={{ color: C.muted, fontSize: 13 }} {...A('text-progress-summary')}>
          Log the same exercise twice to see your progress chart.
        </Text>
      </View>
    );
  }

  const pad = 24;
  const tops = series.map((p) => p.top);
  const min = Math.min(...tops);
  const max = Math.max(...tops);
  const span = max - min || 1;
  const stepX = (width - pad * 2) / (series.length - 1);

  const points = series.map((p, i) => {
    const x = pad + i * stepX;
    const y = height - pad - ((p.top - min) / span) * (height - pad * 2);
    return { x, y, top: p.top };
  });
  const polyline = points.map((pt) => `${pt.x},${pt.y}`).join(' ');
  const best = max;
  const change = tops[tops.length - 1] - tops[0];
  const summary = `Best ${best}kg · ${change >= 0 ? '+' : ''}${change}kg over ${series.length} sessions`;

  return (
    <View {...A('chart-progress')}>
      <Svg width={width} height={height}>
        <Line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke={C.border} strokeWidth="1" />
        <Polyline points={polyline} fill="none" stroke={C.primary} strokeWidth="2" />
        {points.map((pt, i) => (
          <Circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill={C.primary} />
        ))}
        <SvgText x={pad} y={14} fill={C.muted} fontSize="11">{max}kg</SvgText>
        <SvgText x={pad} y={height - pad - 2} fill={C.muted} fontSize="11">{min}kg</SvgText>
      </Svg>
      <Text style={{ color: C.text, fontSize: 13, marginTop: 4 }} {...A('text-progress-summary')}>{summary}</Text>
    </View>
  );
}
