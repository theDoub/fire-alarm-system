/**
 * types/declarations.d.ts
 * Custom module declarations for third-party packages without standard TS types.
 */
declare module 'react-native-vector-icons/Feather' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';
  
  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }
  
  export default class Icon extends Component<IconProps> {}
}
