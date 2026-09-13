import type { Preview } from '@storybook/react';
import '../src/tokens/tokens.css';
import '../src/styles.css';

const preview: Preview = {
  parameters: { a11y: { element: '#storybook-root' }, layout: 'fullscreen' },
  globalTypes: { theme: { description: 'Theme', defaultValue: 'light', toolbar: { title: 'Theme', icon: 'paintbrush', items: ['light', 'dark'] } } },
  decorators: [(Story, context) => <div data-theme={context.globals.theme} style={{ background: 'var(--cg-color-bg)', color: 'var(--cg-color-ink)', minHeight: '100vh', padding: 'var(--cg-space-8)' }}><Story /></div>],
};

export default preview;
