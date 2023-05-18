import { describe, test, jest, expect } from '@jest/globals';

import { natsWrapper } from '../nats-wrapper';

describe('[Nats wrapper]', () => {
  test('should be init', async () => {
    await natsWrapper.init('cluster', 'client', { url: 'local' });
    expect(natsWrapper.init).toHaveBeenCalled();
    expect(natsWrapper.connect).toHaveBeenCalled();
    expect(natsWrapper.listeners).toHaveBeenCalled();
    expect(natsWrapper.closeEvent).toHaveBeenCalled();
  });
});
