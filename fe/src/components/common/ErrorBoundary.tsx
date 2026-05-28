import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error.message, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>⚠️ Something went wrong</Text>
          <ScrollView style={styles.box}>
            <Text style={styles.message}>{this.state.error?.message}</Text>
            <Text style={styles.stack}>{this.state.error?.stack}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={this.reset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 24, justifyContent: 'center' },
  title: { color: '#e94560', fontSize: 20, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  box: { backgroundColor: '#1a1a2e', borderRadius: 10, padding: 14, maxHeight: 300, marginBottom: 20 },
  message: { color: '#ffc107', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  stack: { color: '#888', fontSize: 11, lineHeight: 16 },
  button: { backgroundColor: '#e94560', borderRadius: 12, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
