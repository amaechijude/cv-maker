import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  hiddenSection: {
    height: 1,
    overflow: 'hidden',
    opacity: 0,
    color: '#FFFFFF', // Invisible on white background
    fontSize: 1,
  }
});

export const ATSKeywordsSection = ({ keywords }: { keywords?: string[] }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <View style={styles.hiddenSection}>
      <Text>
        Keywords: {keywords.join(', ')}
      </Text>
    </View>
  );
};
