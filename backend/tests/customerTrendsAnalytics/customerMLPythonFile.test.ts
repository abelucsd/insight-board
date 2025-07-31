import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { EventEmitter } from 'events';
import { spawn } from 'child_process';
import { runPythonFile } from '../../src/workers/analytics/customer/runPythonFile';

jest.mock('child_process');
describe("Customer - Machine Learning Python File unit tests", () => {
  
  describe('runPythonFile', () => {    
    
    it('should run the Python File', async () => {
      
    const mockProcess = new EventEmitter() as any;
    const mockStdout = new EventEmitter();
    const mockStderr = new EventEmitter();     
    mockProcess.stdout = mockStdout;
    mockProcess.stderr = mockStderr;

    (spawn as jest.Mock).mockReturnValue(mockProcess);

    const promise = runPythonFile('test.py');

    mockStdout.emit('data', Buffer.from('mocked output'));
    mockProcess.emit('close', 0);

    const result = await promise;
    expect(result).toBe('mocked output');
    });
  });
});